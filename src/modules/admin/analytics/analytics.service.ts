import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AnalyticsOverviewQueryDto, AnalyticsChartsQueryDto, AnalyticsPeriod } from '../dto/admin.dto';
import { OrderStatus, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class AdminAnalyticsService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(period: AnalyticsPeriod, start?: string, end?: string) {
    let startDate = new Date();
    let endDate = new Date();

    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    } else {
      if (period === AnalyticsPeriod.DAILY) {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === AnalyticsPeriod.WEEKLY) {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(startDate.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
      } else if (period === AnalyticsPeriod.MONTHLY) {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      }
    }
    return { startDate, endDate };
  }

  async getOverview(query: AnalyticsOverviewQueryDto) {
    const { startDate, endDate } = this.getDateRange(query.period!, query.startDate, query.endDate);

    const validOrderStatuses = [
      OrderStatus.PAID,
      OrderStatus.IN_KITCHEN,
      OrderStatus.ON_DELIVERY,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
    ];

    const revenueResult = await this.prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        status: { in: validOrderStatuses },
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const activeSubscribers = await this.prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    const totalOrders = await this.prisma.order.count({
      where: {
        status: { not: OrderStatus.CANCELLED },
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    // Urgent Alerts: Orders with status PAID scheduled for delivery today but not IN_KITCHEN
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const urgentAlertsCount = await this.prisma.order.count({
      where: {
        status: OrderStatus.PAID,
        estimatedArrival: { gte: todayStart, lte: todayEnd },
      },
    });

    return {
      period: query.period,
      totalRevenue: Number(revenueResult._sum.totalPrice || 0),
      activeSubscribers,
      totalOrders,
      urgentAlertsCount,
    };
  }

  async getCharts(query: AnalyticsChartsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query.period);
    // In a real production system, this would be grouped using raw SQL or grouped using Prisma.
    // We will do a basic grouped aggregation for volume and revenue.
    
    // For simplicity, fetching orders in range and aggregating in memory.
    // For massive scale, `prisma.$queryRaw` with `DATE_FORMAT` is required.
    const validOrderStatuses = [
      OrderStatus.PAID,
      OrderStatus.IN_KITCHEN,
      OrderStatus.ON_DELIVERY,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
    ];

    const orders = await this.prisma.order.findMany({
      where: {
        status: { in: validOrderStatuses },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const chartMap = new Map<string, { date: string; revenue: number; volume: number }>();

    orders.forEach((order) => {
      let dateKey = order.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      
      if (query.period === AnalyticsPeriod.MONTHLY) {
        // Group by day for monthly
        dateKey = order.createdAt.toISOString().slice(0, 10);
      } else if (query.period === AnalyticsPeriod.WEEKLY) {
        dateKey = order.createdAt.toISOString().slice(0, 10);
      } else {
        // Group by hour for daily
        dateKey = order.createdAt.toISOString().slice(0, 13) + ':00:00';
      }

      if (!chartMap.has(dateKey)) {
        chartMap.set(dateKey, { date: dateKey, revenue: 0, volume: 0 });
      }

      const item = chartMap.get(dateKey)!;
      item.revenue += Number(order.totalPrice);
      item.volume += 1;
    });

    return Array.from(chartMap.values());
  }
}
