import { Body, Controller, Get, Param, Post, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SkipDayDto } from './dto/skip-day.dto';
import { PauseSubscriptionDto } from './dto/pause-subscription.dto';

@ApiTags('Subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req: any) {
    const result = await this.subscriptionService.create(req.user.id, createSubscriptionDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Subscription created successfully',
      data: result,
    };
  }

  @Get('my')
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Get all subscriptions for logged-in user' })
  async getMySubscriptions(@Request() req: any) {
    const result = await this.subscriptionService.findByUser(req.user.id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscriptions retrieved successfully',
      data: result,
    };
  }

  @Get(':id')
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Get detail of a specific subscription' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const result = await this.subscriptionService.findOne(id, req.user.id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscription detail retrieved successfully',
      data: result,
    };
  }

  @Post(':id/skip-day')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Skip a specific day in the subscription' })
  async skipDay(@Param('id') id: string, @Body() skipDayDto: SkipDayDto, @Request() req: any) {
    const result = await this.subscriptionService.skipDay(id, req.user.id, skipDayDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Skip day processed successfully',
      data: result,
    };
  }

  @Post(':id/pause')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause the subscription' })
  async pause(@Param('id') id: string, @Body() pauseDto: PauseSubscriptionDto, @Request() req: any) {
    const result = await this.subscriptionService.pause(id, req.user.id, pauseDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscription paused successfully',
      data: result,
    };
  }

  @Post(':id/resume')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume a paused subscription' })
  async resume(@Param('id') id: string, @Request() req: any) {
    const result = await this.subscriptionService.resume(id, req.user.id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscription resumed successfully',
      data: result,
    };
  }
}
