import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAnalyticsService } from './analytics.service';
import { AnalyticsOverviewQueryDto, AnalyticsChartsQueryDto } from '../dto/admin.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get executive dashboard overview metrics' })
  async getOverview(@Query() query: AnalyticsOverviewQueryDto) {
    return this.analyticsService.getOverview(query);
  }

  @Get('charts')
  @ApiOperation({ summary: 'Get charting data for revenue and order volumes' })
  async getCharts(@Query() query: AnalyticsChartsQueryDto) {
    return this.analyticsService.getCharts(query);
  }
}
