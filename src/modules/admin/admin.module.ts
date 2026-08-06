import { Module } from '@nestjs/common';
import { AdminAnalyticsController } from './analytics/analytics.controller';
import { AdminAnalyticsService } from './analytics/analytics.service';
import { AdminCustomersController } from './customers/customers.controller';
import { AdminCustomersService } from './customers/customers.service';
import { AdminSettingsController } from './settings/settings.controller';
import { AdminSettingsService } from './settings/settings.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminAnalyticsController,
    AdminCustomersController,
    AdminSettingsController,
  ],
  providers: [
    AdminAnalyticsService,
    AdminCustomersService,
    AdminSettingsService,
  ],
})
export class AdminModule {}
