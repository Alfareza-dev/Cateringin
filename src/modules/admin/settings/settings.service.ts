import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateSettingsDto } from '../dto/admin.dto';

@Injectable()
export class AdminSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSetting.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await this.prisma.systemSetting.create({
        data: { id: 1 },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    return this.prisma.systemSetting.upsert({
      where: { id: 1 },
      update: {
        kitchenLatitude: dto.kitchenLatitude,
        kitchenLongitude: dto.kitchenLongitude,
        baseDeliveryFee: dto.baseDeliveryFee,
        feePerKm: dto.feePerKm,
        maxRadiusKm: dto.maxRadiusKm,
        businessName: dto.businessName,
        businessPhone: dto.businessPhone,
        businessAddress: dto.businessAddress,
      },
      create: {
        id: 1,
        kitchenLatitude: dto.kitchenLatitude,
        kitchenLongitude: dto.kitchenLongitude,
        baseDeliveryFee: dto.baseDeliveryFee,
        feePerKm: dto.feePerKm,
        maxRadiusKm: dto.maxRadiusKm,
        businessName: dto.businessName,
        businessPhone: dto.businessPhone,
        businessAddress: dto.businessAddress,
      },
    });
  }
}
