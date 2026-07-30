import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CoverageCheckDto } from './dto/coverage-check.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GetScheduleFilterDto } from '../menu/dto/get-schedule-filter.dto';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getActiveMenus(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.menu.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.menu.count({ where: { isActive: true } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSchedules(filterDto: GetScheduleFilterDto) {
    const { startDate, endDate } = filterDto;
    
    const where: any = {
      menu: {
        isActive: true,
      },
    };
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    const schedules = await this.prisma.dailyMenuSchedule.findMany({
      where,
      include: {
        menu: true,
      },
      orderBy: { date: 'asc' },
    });

    const grouped = schedules.reduce((acc, curr) => {
      const dateKey = curr.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(curr);
      return acc;
    }, {} as Record<string, typeof schedules>);

    return grouped;
  }

  async getActiveSlots() {
    return this.prisma.deliverySlot.findMany({
      where: { isActive: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async checkCoverage(coverageCheckDto: CoverageCheckDto) {
    const { latitude, longitude } = coverageCheckDto;

    const kitchenLat = this.configService.get<number>('KITCHEN_LATITUDE') || -7.9666;
    const kitchenLon = this.configService.get<number>('KITCHEN_LONGITUDE') || 112.6326;
    const maxRadiusKm = this.configService.get<number>('MAX_RADIUS_KM') || 15;

    const distanceKm = this.calculateHaversineDistance(
      kitchenLat,
      kitchenLon,
      latitude,
      longitude,
    );

    return {
      isCovered: distanceKm <= maxRadiusKm,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      maxRadiusKm,
    };
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
