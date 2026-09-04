import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminOrdersQueryDto } from '../dto/admin.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(query: AdminOrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const q = query.search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { user: { fullName: { contains: q } } },
        { user: { email: { contains: q } } },
        { user: { phone: { contains: q } } },
      ];
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              menu: {
                select: { id: true, name: true, imageUrl: true },
              },
            },
          },
          slot: {
            select: { id: true, name: true, startTime: true, endTime: true },
          },
          address: {
            select: { id: true, label: true, fullAddress: true },
          },
          payment: {
            select: { id: true, status: true, amount: true, paidAt: true },
          },
        },
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            menu: {
              select: { id: true, name: true, imageUrl: true, price: true },
            },
          },
        },
        slot: true,
        address: true,
        payment: true,
        subscription: {
          select: { id: true, durationDays: true, startDate: true, endDate: true },
        },
        review: {
          select: { id: true, rating: true, comment: true, createdAt: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pesanan dengan id "${id}" tidak ditemukan`);
    }

    return order;
  }
}
