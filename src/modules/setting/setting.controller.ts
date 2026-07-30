import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin System Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOperation({ summary: 'Get current system settings' })
  async getSettings() {
    const data = await this.settingService.getSettings();
    return { success: true, statusCode: 200, message: 'Settings retrieved successfully', data };
  }

  @Patch()
  @ApiOperation({ summary: 'Update system settings' })
  async updateSettings(@Body() updateSettingDto: UpdateSettingDto) {
    const data = await this.settingService.updateSettings(updateSettingDto);
    return { success: true, statusCode: 200, message: 'Settings updated successfully', data };
  }
}
