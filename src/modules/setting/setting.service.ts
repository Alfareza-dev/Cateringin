import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSetting.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      // Create empty default singleton if not exists
      settings = await this.prisma.systemSetting.create({
        data: { id: 1 },
      });
    }

    return settings;
  }

  async updateSettings(updateSettingDto: UpdateSettingDto) {
    // Ensure it exists first
    await this.getSettings();

    return this.prisma.systemSetting.update({
      where: { id: 1 },
      data: updateSettingDto,
    });
  }
}
