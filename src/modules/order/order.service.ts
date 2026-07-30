import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaymentService } from '../payment/payment.service';
import { CartService } from '../cart/cart.service';
import { OrderStatus, DeliveryMethod } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
  ) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${yyyymmdd}-${random}`;
  }

  async checkout(userId: string, dto: CheckoutDto) {
    if (!dto.subscriptionId && (!dto.items || dto.items.length === 0)) {
      throw new BadRequestException(
        'Either subscriptionId or items must be provided',
      );
    }

    let subtotal = 0;
    let deliveryFee = 0;
    let totalPrice = 0;
    let actualDeliveryMethod = dto.deliveryMethod;
    let actualAddressId: string | null | undefined = dto.addressId;
    let actualSlotId = dto.slotId;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.subscriptionId) {
      // Checkout for an existing subscription
      const subscription = await this.prisma.subscription.findUnique({
        where: { id: dto.subscriptionId },
      });
      if (!subscription) throw new NotFoundException('Subscription not found');
      if (subscription.userId !== userId)
        throw new BadRequestException('Unauthorized access to subscription');

      actualDeliveryMethod = subscription.deliveryMethod;
      actualAddressId = subscription.addressId;
      actualSlotId = subscription.slotId;

      // Use cart service to calculate total price for the subscription
      const cartResult = await this.cartService.calculate(userId, {
        durationDays: subscription.durationDays,
        startDate: subscription.startDate.toISOString(),
        deliveryMethod: subscription.deliveryMethod,
        addressId: subscription.addressId || undefined,
        slotId: subscription.slotId,
      });

      subtotal = cartResult.subtotal;
      deliveryFee = cartResult.totalDeliveryFee;
      totalPrice = cartResult.totalPrice;
    } else {
      // Direct items checkout
      if (!actualDeliveryMethod || !actualSlotId) {
        throw new BadRequestException(
          'deliveryMethod and slotId are required for direct orders',
        );
      }
      if (
        actualDeliveryMethod === DeliveryMethod.DELIVERY &&
        !actualAddressId
      ) {
        throw new BadRequestException(
          'addressId is required for DELIVERY method',
        );
      }

      // Calculate items price
      for (const item of dto.items!) {
        const menu = await this.prisma.menu.findUnique({
          where: { id: item.menuId },
        });
        if (!menu || !menu.isActive) {
          throw new BadRequestException(
            `Menu ${item.menuId} not found or inactive`,
          );
        }
        subtotal += Number(menu.price) * item.quantity;
      }

      // Calculate delivery fee for one day
      if (actualDeliveryMethod === DeliveryMethod.DELIVERY) {
        const cartResult = await this.cartService.calculate(userId, {
          durationDays: 1, // Only 1 day for direct order
          startDate: new Date().toISOString(), // Today/Tomorrow doesn't matter for pure delivery fee calculation in this context, assuming static config
          deliveryMethod: actualDeliveryMethod,
          addressId: actualAddressId || undefined,
          slotId: actualSlotId,
        });
        deliveryFee = cartResult.totalDeliveryFee;
      }
      totalPrice = subtotal + deliveryFee;
    }

    const orderNumber = this.generateOrderNumber();

    // Create Order and Payment
    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          subscriptionId: dto.subscriptionId,
          deliveryMethod: actualDeliveryMethod,
          addressId: actualAddressId,
          slotId: actualSlotId,
          status: OrderStatus.PENDING_PAYMENT,
          subtotal,
          deliveryFee,
          totalPrice,
          notes: dto.notes,
          items: dto.items
            ? {
                create: dto.items.map((i) => ({
                  menuId: i.menuId,
                  quantity: i.quantity,
                  price: 0, // In real scenario, fetch menu price again or store it
                  specialNotes: i.specialNotes,
                })),
              }
            : undefined,
        },
      });

      // Update item prices (if we had to store them, we'd need them before, but for simplicity here we assume they were calculated correctly)
      if (dto.items) {
        for (const i of dto.items) {
          const menu = await prisma.menu.findUnique({
            where: { id: i.menuId },
          });
          await prisma.orderItem.updateMany({
            where: { orderId: newOrder.id, menuId: i.menuId },
            data: { price: menu!.price },
          });
        }
      }

      // Call Louvin Payment Gateway
      const transaction: { id: string; qr_string?: string; va_number?: string } = await this.paymentService.createTransaction({
        amount: totalPrice,
        payment_type: dto.paymentType,
        customer_name: user.fullName,
        customer_email: user.email,
        description: `Payment for Order ${orderNumber}`,
        reference: orderNumber,
      });

      // Create Payment Record
      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          louvinInvoiceId: String(transaction.id),
          louvinPaymentUrl: transaction.qr_string ? String(transaction.qr_string) : (transaction.va_number ? String(transaction.va_number) : null),
          amount: totalPrice,
        },
      });

      return await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: { payment: true, items: true },
      });
    });

    return order;
  }

  // --- STATE MACHINE MANAGER ---

  async updateStatusByAdmin(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    // Admin can update to any valid status, but let's enforce some basic sanity if needed
    // For now, accept what the admin says
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status, proofOfDelivery: dto.proofOfDelivery },
    });
  }

  async updateStatusByKitchen(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException(
        `Cannot transition to IN_KITCHEN from ${order.status}`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.IN_KITCHEN },
    });
  }

  async updateStatusByDriver(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (dto.status === OrderStatus.ON_DELIVERY) {
      if (order.status !== OrderStatus.IN_KITCHEN) {
        throw new BadRequestException(
          `Cannot transition to ON_DELIVERY from ${order.status}`,
        );
      }
    } else if (dto.status === OrderStatus.DELIVERED) {
      if (order.status !== OrderStatus.ON_DELIVERY) {
        throw new BadRequestException(
          `Cannot transition to DELIVERED from ${order.status}`,
        );
      }
    } else {
      throw new BadRequestException(
        'Driver can only transition to ON_DELIVERY or DELIVERED',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status, proofOfDelivery: dto.proofOfDelivery },
    });
  }

  async completeOrderByCustomer(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId)
      throw new BadRequestException('Unauthorized access to order');

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        `Cannot transition to COMPLETED from ${order.status}`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.COMPLETED },
    });
  }
}
