import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculateCartDto } from './dto/calculate-cart.dto';
import { DeliveryMethod } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(userId: string, dto: CalculateCartDto) {
    if (dto.deliveryMethod === DeliveryMethod.DELIVERY && !dto.addressId) {
      throw new BadRequestException(
        'addressId is required for DELIVERY method',
      );
    }

    const slot = await this.prisma.deliverySlot.findUnique({
      where: { id: dto.slotId },
    });
    if (!slot || !slot.isActive) {
      throw new NotFoundException('Delivery slot not found or inactive');
    }

    let distanceKm = 0;
    let dailyDeliveryFee = 0;

    if (dto.deliveryMethod === DeliveryMethod.DELIVERY) {
      const address = await this.prisma.address.findFirst({
        where: { id: dto.addressId, userId },
      });
      if (!address) {
        throw new NotFoundException('Address not found');
      }

      const setting = await this.prisma.systemSetting.findFirst();
      if (!setting || !setting.kitchenLatitude || !setting.kitchenLongitude) {
        throw new BadRequestException(
          'Kitchen location is not configured by admin',
        );
      }

      distanceKm = this.calculateHaversineDistance(
        setting.kitchenLatitude,
        setting.kitchenLongitude,
        address.latitude,
        address.longitude,
      );

      if (setting.maxRadiusKm && distanceKm > setting.maxRadiusKm) {
        throw new BadRequestException(
          `Delivery address exceeds maximum radius of ${setting.maxRadiusKm} km`,
        );
      }

      const baseFee = setting.baseDeliveryFee
        ? Number(setting.baseDeliveryFee)
        : 5000;
      const feePerKm = setting.feePerKm ? Number(setting.feePerKm) : 2000;

      dailyDeliveryFee = baseFee + distanceKm * feePerKm;
    }

    let totalMenuPrice = 0;
    const start = dayjs(dto.startDate);

    const activeMenus = await this.prisma.menu.findMany({
      where: { isActive: true },
      select: { price: true },
    });

    let fallbackPrice = 0;
    if (activeMenus.length > 0) {
      const sum = activeMenus.reduce(
        (acc, menu) => acc + Number(menu.price),
        0,
      );
      fallbackPrice = sum / activeMenus.length;
    }

    for (let i = 0; i < dto.durationDays; i++) {
      const currentDate = start.add(i, 'day').toDate();

      const schedule = await this.prisma.dailyMenuSchedule.findFirst({
        where: { date: currentDate },
        include: { menu: true },
      });

      if (schedule && schedule.menu) {
        totalMenuPrice += Number(schedule.menu.price);
      } else {
        totalMenuPrice += fallbackPrice;
      }
    }

    const totalDeliveryFee = dailyDeliveryFee * dto.durationDays;
    const totalPrice = totalMenuPrice + totalDeliveryFee;

    return {
      subtotal: totalMenuPrice,
      totalDeliveryFee,
      totalPrice,
      distanceKm: Number(distanceKm.toFixed(2)),
      dailyDeliveryFee,
    };
  }

  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
