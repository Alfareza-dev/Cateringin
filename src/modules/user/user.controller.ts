import { Controller, Get, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserOrdersQueryDto } from './dto/user-orders-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return user profile with primary address',
  })
  async getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile (and optionally password)' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. invalid old password)',
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.id, updateProfileDto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Customer: List pesanan milik customer yang sedang login (Pesanan Aktif & Riwayat)' })
  @ApiResponse({ status: 200, description: 'Daftar pesanan customer berhasil diambil' })
  async getOrders(@CurrentUser() user: any, @Query() query: UserOrdersQueryDto) {
    const result = await this.userService.getOrders(user.id, query);
    return {
      success: true,
      statusCode: 200,
      message: 'Daftar pesanan berhasil diambil',
      ...result,
    };
  }
}
