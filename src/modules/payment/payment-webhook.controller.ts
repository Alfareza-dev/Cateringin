import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, OrderStatus, SubscriptionStatus } from '@prisma/client';

@ApiTags('Payment Webhook')
@Controller('payments/louvin')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Louvin payment webhook' })
  async handleCallback(@Body() body: Record<string, any>) {
    this.logger.log(`Received webhook from Louvin: ${JSON.stringify(body)}`);

    const { event, data } = body;
    if (!event || !data || !data.order_id) {
      return { received: true };
    }

    const { order_id } = data; // Note: In createTransaction, we pass reference = orderNumber, so order_id from Louvin is likely the orderNumber. Let's find order by orderNumber.

    try {
      const order = await this.prisma.order.findUnique({
        where: { orderNumber: order_id },
        include: { payment: true },
      });

      if (!order || !order.payment) {
        this.logger.warn(
          `Order or Payment not found for reference: ${order_id}`,
        );
        return { received: true };
      }

      if (event === 'payment.settled') {
        await this.prisma.$transaction(async (prisma) => {
          // Update Payment
          await prisma.payment.update({
            where: { id: order.payment!.id },
            data: {
              status: PaymentStatus.SUCCESS,
              paidAt: new Date(),
              rawCallbackPayload: body,
            },
          });

          // Update Order
          await prisma.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.PAID },
          });

          // If linked to Subscription, update Subscription
          if (order.subscriptionId) {
            const subscription = await prisma.subscription.findUnique({
              where: { id: order.subscriptionId },
            });
            if (
              subscription &&
              subscription.status === SubscriptionStatus.PENDING_PAYMENT
            ) {
              await prisma.subscription.update({
                where: { id: subscription.id },
                data: { status: SubscriptionStatus.ACTIVE },
              });
            }
          }
        });
      } else if (event === 'payment.failed') {
        await this.prisma.$transaction(async (prisma) => {
          // Update Payment
          await prisma.payment.update({
            where: { id: order.payment!.id },
            data: {
              status: PaymentStatus.FAILED, // or EXPIRED
              rawCallbackPayload: body,
            },
          });

          // Update Order
          await prisma.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          });

          // If linked to Subscription, update Subscription
          if (order.subscriptionId) {
            const subscription = await prisma.subscription.findUnique({
              where: { id: order.subscriptionId },
            });
            if (subscription) {
              await prisma.subscription.update({
                where: { id: subscription.id },
                data: { status: SubscriptionStatus.CANCELLED },
              });
            }
          }
        });
      }
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
    }

    // Always respond with 200 OK { received: true } to prevent retries
    return { received: true };
  }
}
