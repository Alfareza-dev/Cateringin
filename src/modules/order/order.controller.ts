import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order/checkout')
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Checkout an order or subscription' })
  @ApiResponse({
    status: 201,
    description: 'Order checked out and payment created',
  })
  async checkout(@Body() checkoutDto: CheckoutDto, @Request() req: { user: { id: string } }) {
    const result = await this.orderService.checkout(req.user.id, checkoutDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Checkout successful',
      data: result,
    };
  }

  @Patch('admin/orders/:id/status')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin: Update order status arbitrarily' })
  async updateStatusByAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const result = await this.orderService.updateStatusByAdmin(id, dto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Order status updated by Admin',
      data: result,
    };
  }

  @Patch('kitchen/orders/:id/status')
  @Roles(Role.KITCHEN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kitchen: Mark order as IN_KITCHEN' })
  async updateStatusByKitchen(@Param('id') id: string) {
    const result = await this.orderService.updateStatusByKitchen(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Order status updated to IN_KITCHEN',
      data: result,
    };
  }

  @Patch('driver/orders/:id/status')
  @Roles(Role.DRIVER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Driver: Mark order as ON_DELIVERY or DELIVERED' })
  async updateStatusByDriver(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const result = await this.orderService.updateStatusByDriver(id, dto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Order status updated to ${dto.status}`,
      data: result,
    };
  }

  @Patch('user/orders/:id/complete')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer: Confirm order is COMPLETED' })
  async completeOrderByCustomer(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    const result = await this.orderService.completeOrderByCustomer(
      id,
      req.user.id,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Order completed by Customer',
      data: result,
    };
  }

  @Get('user/orders/:id/tracking')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Track order progress and ETA' })
  async trackOrder(@Param('id') id: string, @Request() req: { user: { id: string, role: string } }) {
    const result = await this.orderService.trackOrder(id, req.user);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Order tracking details retrieved',
      data: result,
    };
  }
}
