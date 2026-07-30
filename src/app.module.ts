import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
import { SlotModule } from './modules/slot/slot.module';
import { PublicModule } from './modules/public/public.module';
import { MenuModule } from './modules/menu/menu.module';
import { SettingModule } from './modules/setting/setting.module';
import { CartModule } from './modules/cart/cart.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    AddressModule,
    SlotModule,
    PublicModule,
    MenuModule,
    SettingModule,
    CartModule,
    SubscriptionModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
