import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [PaymentModule, CartModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
