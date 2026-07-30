import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { CoverageCheckDto } from './dto/coverage-check.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GetScheduleFilterDto } from '../menu/dto/get-schedule-filter.dto';

@ApiTags('Public Catalog & Coverage')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('menus/active')
  @ApiOperation({ summary: 'Get all active menus for public catalog' })
  async getActiveMenus(@Query() paginationDto: PaginationDto) {
    const data = await this.publicService.getActiveMenus(paginationDto);
    return {
      success: true,
      statusCode: 200,
      message: 'Active menus retrieved successfully',
      data,
    };
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get active menu schedules for customer calendar' })
  async getSchedules(@Query() filterDto: GetScheduleFilterDto) {
    const data = await this.publicService.getSchedules(filterDto);
    return {
      success: true,
      statusCode: 200,
      message: 'Schedules retrieved successfully',
      data,
    };
  }

  @Get('slots')
  @ApiOperation({ summary: 'Get all active delivery slots' })
  async getActiveSlots() {
    const data = await this.publicService.getActiveSlots();
    return {
      success: true,
      statusCode: 200,
      message: 'Active slots retrieved successfully',
      data,
    };
  }

  @Post('coverage-check')
  @ApiOperation({ summary: 'Check delivery coverage using Haversine formula' })
  async checkCoverage(@Body() coverageCheckDto: CoverageCheckDto) {
    const data = await this.publicService.checkCoverage(coverageCheckDto);
    return {
      success: true,
      statusCode: 200,
      message: 'Coverage checked successfully',
      data,
    };
  }
}
