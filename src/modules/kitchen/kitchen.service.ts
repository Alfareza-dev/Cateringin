import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, DeliveryMethod, Prisma } from '@prisma/client';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(dateStr: string) {
    // Taking Asia/Jakarta (UTC+7) into account
    const start = new Date(`${dateStr}T00:00:00.000+07:00`);
    const end = new Date(`${dateStr}T23:59:59.999+07:00`);
    return { start, end };
  }

  async getBatchView(date: string, slotId?: string) {
    const { start, end } = this.getDateRange(date);

    const whereClause: Prisma.OrderWhereInput = {
      estimatedArrival: { gte: start, lte: end },
      status: { in: [OrderStatus.PAID, OrderStatus.IN_KITCHEN] },
    };

    if (slotId) {
      whereClause.slotId = slotId;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        slot: true,
        user: true,
        items: {
          include: {
            menu: true,
          },
        },
      },
    });

    let totalOrders = orders.length;
    let totalPortions = 0;

    const itemsMap = new Map<string, { menuId: string; menuName: string; totalQuantity: number }>();
    const specialNotes: Array<{ orderNumber: string; customerName: string; note: string }> = [];

    // If slotId is provided and orders exist, we can use the slot from the first order or fetch it
    let slotInfo = null;
    if (slotId) {
      const slot = await this.prisma.deliverySlot.findUnique({ where: { id: slotId } });
      if (slot) {
        slotInfo = { id: slot.id, name: `${slot.name} (${slot.startTime} - ${slot.endTime})` };
      }
    }

    orders.forEach((order: any) => {
      // If we didn't have a specific slotId query but we have orders, just grab one if needed, or leave it null.
      // Usually, batch views are per slot.
      
      order.items.forEach((item: any) => {
        totalPortions += item.quantity;

        if (!itemsMap.has(item.menuId)) {
          itemsMap.set(item.menuId, {
            menuId: item.menuId,
            menuName: item.menu.name,
            totalQuantity: 0,
          });
        }
        
        const currentItem = itemsMap.get(item.menuId)!;
        currentItem.totalQuantity += item.quantity;

        if (item.specialNotes) {
          specialNotes.push({
            orderNumber: order.orderNumber,
            customerName: order.user.fullName,
            note: `[${item.menu.name} x${item.quantity}] ${item.specialNotes}`,
          });
        }
      });

      if (order.notes) {
        specialNotes.push({
          orderNumber: order.orderNumber,
          customerName: order.user.fullName,
          note: `[Order Level] ${order.notes}`,
        });
      }
    });

    return {
      date,
      slot: slotInfo,
      totalOrders,
      totalPortions,
      aggregatedItems: Array.from(itemsMap.values()),
      specialNotes,
    };
  }

  async startCookingBatch(date: string, slotId: string) {
    const { start, end } = this.getDateRange(date);

    const updateResult = await this.prisma.order.updateMany({
      where: {
        estimatedArrival: { gte: start, lte: end },
        slotId,
        status: OrderStatus.PAID,
      },
      data: {
        status: OrderStatus.IN_KITCHEN,
      },
    });

    return { updatedCount: updateResult.count };
  }

  async getLabels(date: string, slotId?: string) {
    const { start, end } = this.getDateRange(date);

    const whereClause: Prisma.OrderWhereInput = {
      estimatedArrival: { gte: start, lte: end },
      status: { in: [OrderStatus.PAID, OrderStatus.IN_KITCHEN] },
    };

    if (slotId) {
      whereClause.slotId = slotId;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        user: true,
        address: true,
        slot: true,
        items: {
          include: {
            menu: true,
          },
        },
      },
    });

    return orders.map(this.formatOrderForLabel);
  }

  async getSingleLabel(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        address: true,
        slot: true,
        items: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.formatOrderForLabel(order);
  }

  private formatOrderForLabel(order: any) {
    return {
      orderNumber: order.orderNumber,
      customerName: order.user.fullName,
      customerPhone: order.user.phone,
      deliveryMethod: order.deliveryMethod,
      fullAddress: order.deliveryMethod === DeliveryMethod.DELIVERY && order.address ? order.address.fullAddress : null,
      addressNote: order.deliveryMethod === DeliveryMethod.DELIVERY && order.address ? order.address.note : null,
      pickupPin: order.deliveryMethod === DeliveryMethod.PICKUP ? order.pickupPin : null,
      slotName: order.slot.name,
      slotTime: `${order.slot.startTime} - ${order.slot.endTime}`,
      items: order.items.map((item: any) => ({
        menuName: item.menu.name,
        quantity: item.quantity,
        specialNotes: item.specialNotes,
      })),
      overallNotes: order.notes,
    };
  }
}
