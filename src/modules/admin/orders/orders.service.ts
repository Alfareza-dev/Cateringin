import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminOrdersQueryDto, BatchUpdateOrderStatusDto } from '../dto/admin.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(query: AdminOrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    // Parse status: bisa satu nilai (PAID) atau beberapa dipisah koma (PAID,IN_KITCHEN)
    if (query.status && query.status !== 'ALL') {
      const statusList = query.status
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean) as any[];

      if (statusList.length === 1) {
        where.status = statusList[0];
      } else if (statusList.length > 1) {
        where.status = { in: statusList };
      }
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

  async batchUpdateStatus(dto: BatchUpdateOrderStatusDto) {
    const { orderIds, status, rejectionReason } = dto;
    if (!orderIds || orderIds.length === 0) {
      return { updatedCount: 0, status };
    }

    const data: Prisma.OrderUpdateManyMutationInput = {
      status,
    };
    if (status === OrderStatus.CANCELLED && rejectionReason) {
      data.rejectionReason = rejectionReason;
    }

    const result = await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds },
      },
      data,
    });

    return {
      updatedCount: result.count,
      status,
    };
  }
}
