import { Controller, Get, Patch, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminCustomersService } from './customers.service';
import { CustomersQueryDto, UpdateCustomerStatusDto } from '../dto/admin.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/customers')
export class AdminCustomersController {
  constructor(private readonly customersService: AdminCustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List and search customers' })
  async getCustomers(@Query() query: CustomersQueryDto) {
    return this.customersService.getCustomers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed customer profile' })
  async getCustomerById(@Param('id') id: string) {
    return this.customersService.getCustomerById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Enable or disable customer account' })
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body() body: UpdateCustomerStatusDto,
  ) {
    return this.customersService.updateCustomerStatus(id, body);
  }
}
