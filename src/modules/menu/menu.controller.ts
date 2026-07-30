import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateMenuScheduleDto } from './dto/create-menu-schedule.dto';
import { BulkCreateMenuScheduleDto } from './dto/bulk-create-menu-schedule.dto';
import { GetMenuFilterDto } from './dto/get-menu-filter.dto';
import { GetScheduleFilterDto } from './dto/get-schedule-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin Menu & Scheduler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // --- Menu CRUD ---

  @Post('menus')
  @ApiOperation({ summary: 'Create a new menu' })
  async create(@Body() createMenuDto: CreateMenuDto) {
    const data = await this.menuService.create(createMenuDto);
    return { success: true, statusCode: 201, message: 'Menu created successfully', data };
  }

  @Get('menus')
  @ApiOperation({ summary: 'Get all menus with filters and pagination' })
  async findAll(@Query() filterDto: GetMenuFilterDto) {
    const data = await this.menuService.findAll(filterDto);
    return { success: true, statusCode: 200, message: 'Menus retrieved successfully', data };
  }

  @Get('menus/:id')
  @ApiOperation({ summary: 'Get menu by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.menuService.findOne(id);
    return { success: true, statusCode: 200, message: 'Menu retrieved successfully', data };
  }

  @Patch('menus/:id')
  @ApiOperation({ summary: 'Update a menu' })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const data = await this.menuService.update(id, updateMenuDto);
    return { success: true, statusCode: 200, message: 'Menu updated successfully', data };
  }

  @Delete('menus/:id')
  @ApiOperation({ summary: 'Soft delete a menu' })
  async remove(@Param('id') id: string) {
    const data = await this.menuService.remove(id);
    return { success: true, statusCode: 200, message: 'Menu deleted successfully', data };
  }

  // --- Scheduler Logic ---

  @Post('menu-schedules')
  @ApiOperation({ summary: 'Schedule a menu for a specific date' })
  async scheduleMenu(@Body() createMenuScheduleDto: CreateMenuScheduleDto) {
    const data = await this.menuService.scheduleMenu(createMenuScheduleDto);
    return { success: true, statusCode: 201, message: 'Menu scheduled successfully', data };
  }

  @Post('menu-schedules/bulk')
  @ApiOperation({ summary: 'Bulk schedule menus across multiple dates' })
  async bulkScheduleMenus(@Body() bulkDto: BulkCreateMenuScheduleDto) {
    const data = await this.menuService.bulkScheduleMenus(bulkDto);
    return { success: true, statusCode: 201, message: data.message, data };
  }

  @Get('menu-schedules')
  @ApiOperation({ summary: 'Get menu schedules filtered by date range' })
  async getSchedules(@Query() filterDto: GetScheduleFilterDto) {
    const data = await this.menuService.getSchedules(filterDto);
    return { success: true, statusCode: 200, message: 'Menu schedules retrieved successfully', data };
  }

  @Delete('menu-schedules/:id')
  @ApiOperation({ summary: 'Delete a scheduled menu' })
  async removeSchedule(@Param('id') id: string) {
    const data = await this.menuService.removeSchedule(id);
    return { success: true, statusCode: 200, message: 'Menu schedule deleted successfully', data };
  }
}
