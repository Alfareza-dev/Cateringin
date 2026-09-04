import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminOrdersService } from './orders.service';
import { AdminOrdersQueryDto } from '../dto/admin.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  /**
   * GET /admin/orders
   * List semua pesanan untuk admin, dengan filter search, status, page, limit
   */
  @Get()
  @ApiOperation({ summary: 'Admin: List semua pesanan (dengan search, status, page, limit)' })
  async getOrders(@Query() query: AdminOrdersQueryDto) {
    const result = await this.adminOrdersService.getOrders(query);
    return {
      success: true,
      statusCode: 200,
      message: 'Daftar pesanan berhasil diambil',
      ...result,
    };
  }

  /**
   * GET /admin/orders/:id
   * Detail 1 pesanan lengkap untuk admin
   */
  @Get(':id')
  @ApiOperation({ summary: 'Admin: Detail 1 pesanan berdasarkan ID' })
  async getOrderById(@Param('id') id: string) {
    const data = await this.adminOrdersService.getOrderById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Detail pesanan berhasil diambil',
      data,
    };
  }
}
