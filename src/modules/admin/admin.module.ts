import { Module } from '@nestjs/common';
import { AdminAnalyticsController } from './analytics/analytics.controller';
import { AdminAnalyticsService } from './analytics/analytics.service';
import { AdminCustomersController } from './customers/customers.controller';
import { AdminCustomersService } from './customers/customers.service';
import { AdminSettingsController } from './settings/settings.controller';
import { AdminSettingsService } from './settings/settings.service';
import { AdminOrdersController } from './orders/orders.controller';
import { AdminOrdersService } from './orders/orders.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminAnalyticsController,
    AdminCustomersController,
    AdminSettingsController,
    AdminOrdersController,
  ],
  providers: [
    AdminAnalyticsService,
    AdminCustomersService,
    AdminSettingsService,
    AdminOrdersService,
  ],
})
export class AdminModule {}
