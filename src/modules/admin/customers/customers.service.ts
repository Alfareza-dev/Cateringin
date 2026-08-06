import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomersQueryDto, UpdateCustomerStatusDto } from '../dto/admin.dto';
import { Role, OrderStatus, Prisma, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class AdminCustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(query: CustomersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = { role: Role.CUSTOMER };

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search } },
        { email: { contains: query.search } },
        { phone: { contains: query.search } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            where: { status: OrderStatus.COMPLETED },
            select: { totalPrice: true },
          },
          subscriptions: {
            where: { status: SubscriptionStatus.ACTIVE },
            select: { id: true },
          },
        },
      }),
    ]);

    const data = users.map((u) => {
      const totalSpending = u.orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        isActive: u.isActive,
        createdAt: u.createdAt,
        totalOrdersCount: u.orders.length,
        totalSpending,
        activeSubscriptionsCount: u.subscriptions.length,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, role: Role.CUSTOMER },
      include: {
        addresses: true,
        subscriptions: {
          include: { slot: true },
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { slot: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Customer not found');
    }

    return user;
  }

  async updateCustomerStatus(id: string, dto: UpdateCustomerStatusDto) {
    const user = await this.prisma.user.findUnique({
      where: { id, role: Role.CUSTOMER },
    });

    if (!user) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isActive: dto.isActive },
        select: { id: true, isActive: true },
      });

      // If user is deactivated, automatically cancel their active subscriptions as per PM decision
      if (!dto.isActive) {
        await prisma.subscription.updateMany({
          where: {
            userId: id,
            status: SubscriptionStatus.ACTIVE,
          },
          data: { status: SubscriptionStatus.CANCELLED },
        });
      }

      return updatedUser;
    });
  }
}
