import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, PublicReviewQueryDto, AdminReviewQueryDto } from './dto/review.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, orderId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { review: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Unauthorized: You do not own this order');
    }

    if (order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Reviews can only be submitted for DELIVERED or COMPLETED orders');
    }

    if (order.review) {
      throw new BadRequestException('A review already exists for this order');
    }

    const review = await this.prisma.$transaction(async (prisma) => {
      const newReview = await prisma.review.create({
        data: {
          orderId,
          userId,
          rating: dto.rating,
          comment: dto.comment,
          photoUrl: dto.photoUrl,
        },
      });

      if (order.status === OrderStatus.DELIVERED) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.COMPLETED },
        });
      }

      return newReview;
    });

    return review;
  }

  async getPublicReviews(query: PublicReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};
    
    if (query.minRating) {
      where.rating = { gte: query.minRating };
    }

    const [total, reviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { fullName: true },
          },
        },
      }),
    ]);

    return {
      data: reviews.map((r) => ({
        id: r.id,
        customerName: r.user.fullName,
        rating: r.rating,
        comment: r.comment,
        photoUrl: r.photoUrl,
        createdAt: r.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAdminReviews(query: AdminReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (query.rating) {
      where.rating = query.rating;
    }

    if (query.search) {
      where.OR = [
        { comment: { contains: query.search } },
        { user: { fullName: { contains: query.search } } },
      ];
    }

    const [total, reviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { fullName: true, email: true },
          },
          order: {
            select: { orderNumber: true },
          },
        },
      }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
