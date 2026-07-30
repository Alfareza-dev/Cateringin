"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const payment_service_1 = require("../payment/payment.service");
const cart_service_1 = require("../cart/cart.service");
const client_1 = require("@prisma/client");
let OrderService = class OrderService {
    prisma;
    paymentService;
    cartService;
    constructor(prisma, paymentService, cartService) {
        this.prisma = prisma;
        this.paymentService = paymentService;
        this.cartService = cartService;
    }
    generateOrderNumber() {
        const date = new Date();
        const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `ORD-${yyyymmdd}-${random}`;
    }
    async checkout(userId, dto) {
        if (!dto.subscriptionId && (!dto.items || dto.items.length === 0)) {
            throw new common_1.BadRequestException('Either subscriptionId or items must be provided');
        }
        let subtotal = 0;
        let deliveryFee = 0;
        let totalPrice = 0;
        let actualDeliveryMethod = dto.deliveryMethod;
        let actualAddressId = dto.addressId;
        let actualSlotId = dto.slotId;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.subscriptionId) {
            const subscription = await this.prisma.subscription.findUnique({
                where: { id: dto.subscriptionId },
            });
            if (!subscription)
                throw new common_1.NotFoundException('Subscription not found');
            if (subscription.userId !== userId)
                throw new common_1.BadRequestException('Unauthorized access to subscription');
            actualDeliveryMethod = subscription.deliveryMethod;
            actualAddressId = subscription.addressId;
            actualSlotId = subscription.slotId;
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
        }
        else {
            if (!actualDeliveryMethod || !actualSlotId) {
                throw new common_1.BadRequestException('deliveryMethod and slotId are required for direct orders');
            }
            if (actualDeliveryMethod === client_1.DeliveryMethod.DELIVERY && !actualAddressId) {
                throw new common_1.BadRequestException('addressId is required for DELIVERY method');
            }
            for (const item of dto.items) {
                const menu = await this.prisma.menu.findUnique({ where: { id: item.menuId } });
                if (!menu || !menu.isActive) {
                    throw new common_1.BadRequestException(`Menu ${item.menuId} not found or inactive`);
                }
                subtotal += Number(menu.price) * item.quantity;
            }
            if (actualDeliveryMethod === client_1.DeliveryMethod.DELIVERY) {
                const cartResult = await this.cartService.calculate(userId, {
                    durationDays: 1,
                    startDate: new Date().toISOString(),
                    deliveryMethod: actualDeliveryMethod,
                    addressId: actualAddressId || undefined,
                    slotId: actualSlotId,
                });
                deliveryFee = cartResult.totalDeliveryFee;
            }
            totalPrice = subtotal + deliveryFee;
        }
        const orderNumber = this.generateOrderNumber();
        const order = await this.prisma.$transaction(async (prisma) => {
            const newOrder = await prisma.order.create({
                data: {
                    orderNumber,
                    userId,
                    subscriptionId: dto.subscriptionId,
                    deliveryMethod: actualDeliveryMethod,
                    addressId: actualAddressId,
                    slotId: actualSlotId,
                    status: client_1.OrderStatus.PENDING_PAYMENT,
                    subtotal,
                    deliveryFee,
                    totalPrice,
                    notes: dto.notes,
                    items: dto.items ? {
                        create: dto.items.map(i => ({
                            menuId: i.menuId,
                            quantity: i.quantity,
                            price: 0,
                            specialNotes: i.specialNotes
                        }))
                    } : undefined
                },
            });
            if (dto.items) {
                for (const i of dto.items) {
                    const menu = await prisma.menu.findUnique({ where: { id: i.menuId } });
                    await prisma.orderItem.updateMany({
                        where: { orderId: newOrder.id, menuId: i.menuId },
                        data: { price: menu.price },
                    });
                }
            }
            const transaction = await this.paymentService.createTransaction({
                amount: totalPrice,
                payment_type: dto.paymentType,
                customer_name: user.fullName,
                customer_email: user.email,
                description: `Payment for Order ${orderNumber}`,
                reference: orderNumber,
            });
            await prisma.payment.create({
                data: {
                    orderId: newOrder.id,
                    louvinInvoiceId: transaction.id,
                    louvinPaymentUrl: transaction.qr_string || transaction.va_number,
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
    async updateStatusByAdmin(id, dto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.order.update({
            where: { id },
            data: { status: dto.status, proofOfDelivery: dto.proofOfDelivery },
        });
    }
    async updateStatusByKitchen(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== client_1.OrderStatus.PAID) {
            throw new common_1.BadRequestException(`Cannot transition to IN_KITCHEN from ${order.status}`);
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: client_1.OrderStatus.IN_KITCHEN },
        });
    }
    async updateStatusByDriver(id, dto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (dto.status === client_1.OrderStatus.ON_DELIVERY) {
            if (order.status !== client_1.OrderStatus.IN_KITCHEN) {
                throw new common_1.BadRequestException(`Cannot transition to ON_DELIVERY from ${order.status}`);
            }
        }
        else if (dto.status === client_1.OrderStatus.DELIVERED) {
            if (order.status !== client_1.OrderStatus.ON_DELIVERY) {
                throw new common_1.BadRequestException(`Cannot transition to DELIVERED from ${order.status}`);
            }
        }
        else {
            throw new common_1.BadRequestException('Driver can only transition to ON_DELIVERY or DELIVERED');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: dto.status, proofOfDelivery: dto.proofOfDelivery },
        });
    }
    async completeOrderByCustomer(id, userId) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.BadRequestException('Unauthorized access to order');
        if (order.status !== client_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException(`Cannot transition to COMPLETED from ${order.status}`);
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: client_1.OrderStatus.COMPLETED },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payment_service_1.PaymentService,
        cart_service_1.CartService])
], OrderService);
//# sourceMappingURL=order.service.js.map