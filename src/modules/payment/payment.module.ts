import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentWebhookController } from './payment-webhook.controller';

@Module({
  controllers: [PaymentWebhookController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
