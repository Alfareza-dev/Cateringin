import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, PublicReviewQueryDto, AdminReviewQueryDto } from './dto/review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Review')
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post('user/orders/:id/review')
  @ApiOperation({ summary: 'Customer: Submit a review for a delivered order' })
  async createReview(
    @Param('id') orderId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.reviewService.createReview(req.user.id, orderId, dto);
  }

  @Get('public/reviews')
  @ApiOperation({ summary: 'Public: Get a paginated list of reviews for the landing page' })
  async getPublicReviews(@Query() query: PublicReviewQueryDto) {
    return this.reviewService.getPublicReviews(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/reviews')
  @ApiOperation({ summary: 'Admin: Get a paginated list of all reviews with search' })
  async getAdminReviews(@Query() query: AdminReviewQueryDto) {
    return this.reviewService.getAdminReviews(query);
  }
}
