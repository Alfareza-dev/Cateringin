import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SkipDayDto } from './dto/skip-day.dto';
import { PauseSubscriptionDto } from './dto/pause-subscription.dto';
import { SubscriptionStatus, SkipStatus, DeliveryMethod } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubscriptionDto) {
    if (dto.deliveryMethod === DeliveryMethod.DELIVERY && !dto.addressId) {
      throw new BadRequestException('addressId is required for DELIVERY method');
    }

    const start = dayjs.tz(dto.startDate, 'Asia/Jakarta').startOf('day');
    const tomorrow = dayjs.tz(new Date(), 'Asia/Jakarta').add(1, 'day').startOf('day');

    if (start.isBefore(tomorrow)) {
      throw new BadRequestException('Start date must be at least tomorrow');
    }

    const slot = await this.prisma.deliverySlot.findUnique({
      where: { id: dto.slotId },
    });
    if (!slot || !slot.isActive) {
      throw new NotFoundException('Delivery slot not found or inactive');
    }

    // Capacity checking could be complex (requires counting active subscriptions per day). 
    // For now, basic check on existing subscriptions with the same slot.
    // In a real scenario, we'd check each day's capacity.
    const endDate = start.add(dto.durationDays - 1, 'day');

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        durationDays: dto.durationDays,
        startDate: start.toDate(),
        endDate: endDate.toDate(),
        remainingDays: dto.durationDays,
        status: SubscriptionStatus.PENDING_PAYMENT,
        deliveryMethod: dto.deliveryMethod,
        addressId: dto.addressId,
        slotId: dto.slotId,
      },
    });

    return subscription;
  }

  async findByUser(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: {
        skips: true,
        slot: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, userId },
      include: {
        skips: true,
        slot: true,
        address: true,
        orders: true,
      },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async skipDay(id: string, userId: string, dto: SkipDayDto) {
    const subscription = await this.findOne(id, userId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Only active subscriptions can be skipped');
    }

    const targetDate = dayjs.tz(dto.skipDate, 'Asia/Jakarta').startOf('day');
    this.validateCutOffTime(targetDate.toDate());

    const start = dayjs.tz(subscription.startDate, 'Asia/Jakarta').startOf('day');
    const end = dayjs.tz(subscription.endDate, 'Asia/Jakarta').startOf('day');

    if (targetDate.isBefore(start) || targetDate.isAfter(end)) {
      throw new BadRequestException('Skip date must be within subscription period');
    }

    const existingSkip = await this.prisma.subscriptionSkip.findFirst({
      where: { subscriptionId: id, skipDate: targetDate.toDate(), status: SkipStatus.APPROVED },
    });
    if (existingSkip) {
      throw new BadRequestException('Date is already skipped');
    }

    const newEndDate = end.add(1, 'day');

    const [skip, updatedSub] = await this.prisma.$transaction([
      this.prisma.subscriptionSkip.create({
        data: {
          subscriptionId: id,
          skipDate: targetDate.toDate(),
          status: SkipStatus.APPROVED,
          reason: dto.reason,
        },
      }),
      this.prisma.subscription.update({
        where: { id },
        data: {
          endDate: newEndDate.toDate(),
        },
      }),
    ]);

    return updatedSub;
  }

  async pause(id: string, userId: string, dto: PauseSubscriptionDto) {
    const subscription = await this.findOne(id, userId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Only active subscriptions can be paused');
    }

    const targetDate = dayjs.tz(dto.pauseStartDate, 'Asia/Jakarta').startOf('day');
    this.validateCutOffTime(targetDate.toDate());

    const updatedSub = await this.prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.PAUSED,
      },
    });

    return updatedSub;
  }

  async resume(id: string, userId: string) {
    const subscription = await this.findOne(id, userId);

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException('Only paused subscriptions can be resumed');
    }

    // When resuming, we need to extend the end date by the number of days it was paused.
    // For simplicity, we calculate the difference between now and when it was updated last (paused).
    const now = dayjs.tz(new Date(), 'Asia/Jakarta');
    const pausedAt = dayjs.tz(subscription.updatedAt, 'Asia/Jakarta');
    const diffDays = now.diff(pausedAt, 'day');

    const currentEndDate = dayjs.tz(subscription.endDate, 'Asia/Jakarta');
    const newEndDate = currentEndDate.add(diffDays > 0 ? diffDays : 0, 'day');

    const updatedSub = await this.prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        endDate: newEndDate.toDate(),
      },
    });

    return updatedSub;
  }

  private validateCutOffTime(targetDate: Date) {
    const cutOff = dayjs.tz(targetDate, 'Asia/Jakarta').subtract(1, 'day').hour(18).minute(0).second(0).millisecond(0);
    const now = dayjs.tz(new Date(), 'Asia/Jakarta');

    if (now.isAfter(cutOff)) {
      throw new BadRequestException('Permintaan skip hari gagal: batas waktu maksimal adalah H-1 jam 18:00 WIB.');
    }
  }
}
