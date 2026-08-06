import { Controller, Get, Patch, Query, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { DeliveryQueryDto, UpdateDeliveryStatusDto } from './dto/driver-action.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Driver')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DRIVER, Role.ADMIN)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('deliveries')
  @ApiOperation({ summary: 'Fetch all deliveries for a specific date and slot' })
  async getDeliveries(@Query() query: DeliveryQueryDto) {
    // If date is omitted, default to today's date in YYYY-MM-DD
    let targetDate = query.date;
    if (!targetDate) {
      // Create local date string for Asia/Jakarta (approximate today string)
      const now = new Date();
      // Using en-CA for YYYY-MM-DD format
      targetDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
    }
    
    return this.driverService.getDeliveries(targetDate, query.slotId);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update delivery status (ON_DELIVERY or DELIVERED)' })
  async updateDeliveryStatus(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryStatusDto,
  ) {
    return this.driverService.updateDeliveryStatus(id, body.status, body.proofOfDelivery);
  }
}
