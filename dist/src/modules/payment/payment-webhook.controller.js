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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentWebhookController = PaymentWebhookController_1 = class PaymentWebhookController {
    prisma;
    logger = new common_1.Logger(PaymentWebhookController_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleCallback(body) {
        this.logger.log(`Received webhook from Louvin: ${JSON.stringify(body)}`);
        const { event, data } = body;
        if (!event || !data || !data.order_id) {
            return { received: true };
        }
        const { order_id } = data;
        try {
            const order = await this.prisma.order.findUnique({
                where: { orderNumber: order_id },
                include: { payment: true },
            });
            if (!order || !order.payment) {
                this.logger.warn(`Order or Payment not found for reference: ${order_id}`);
                return { received: true };
            }
            if (event === 'payment.settled') {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.payment.update({
                        where: { id: order.payment.id },
                        data: {
                            status: client_1.PaymentStatus.SUCCESS,
                            paidAt: new Date(),
                            rawCallbackPayload: body,
                        },
                    });
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: client_1.OrderStatus.PAID },
                    });
                    if (order.subscriptionId) {
                        const subscription = await prisma.subscription.findUnique({
                            where: { id: order.subscriptionId },
                        });
                        if (subscription && subscription.status === client_1.SubscriptionStatus.PENDING_PAYMENT) {
                            await prisma.subscription.update({
                                where: { id: subscription.id },
                                data: { status: client_1.SubscriptionStatus.ACTIVE },
                            });
                        }
                    }
                });
            }
            else if (event === 'payment.failed') {
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.payment.update({
                        where: { id: order.payment.id },
                        data: {
                            status: client_1.PaymentStatus.FAILED,
                            rawCallbackPayload: body,
                        },
                    });
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: client_1.OrderStatus.CANCELLED },
                    });
                    if (order.subscriptionId) {
                        const subscription = await prisma.subscription.findUnique({
                            where: { id: order.subscriptionId },
                        });
                        if (subscription) {
                            await prisma.subscription.update({
                                where: { id: subscription.id },
                                data: { status: client_1.SubscriptionStatus.CANCELLED },
                            });
                        }
                    }
                });
            }
        }
        catch (error) {
            this.logger.error(`Error processing webhook: ${error.message}`);
        }
        return { received: true };
    }
};
exports.PaymentWebhookController = PaymentWebhookController;
__decorate([
    (0, common_1.Post)('callback'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Louvin payment webhook' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "handleCallback", null);
exports.PaymentWebhookController = PaymentWebhookController = PaymentWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Payment Webhook'),
    (0, common_1.Controller)('payments/louvin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentWebhookController);
//# sourceMappingURL=payment-webhook.controller.js.map