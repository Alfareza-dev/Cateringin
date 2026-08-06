import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, DeliveryMethod, Prisma } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(dateStr: string) {
    const start = new Date(`${dateStr}T00:00:00.000+07:00`);
    const end = new Date(`${dateStr}T23:59:59.999+07:00`);
    return { start, end };
  }

  // Haversine formula to calculate distance in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getDeliveries(date?: string, slotId?: string) {
    const whereClause: Prisma.OrderWhereInput = {
      status: { in: [OrderStatus.IN_KITCHEN, OrderStatus.ON_DELIVERY] },
      deliveryMethod: DeliveryMethod.DELIVERY,
    };

    if (date) {
      const { start, end } = this.getDateRange(date);
      whereClause.estimatedArrival = { gte: start, lte: end };
    }

    if (slotId) {
      whereClause.slotId = slotId;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        user: true,
        address: true,
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.user.fullName,
      customerPhone: order.user.phone,
      address: order.address?.fullAddress,
      latitude: order.address?.latitude,
      longitude: order.address?.longitude,
      deliveryNotes: order.address?.note || order.notes,
      estimatedArrival: order.estimatedArrival,
    }));
  }

  async updateDeliveryStatus(orderId: string, status: OrderStatus, proofOfDelivery?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.deliveryMethod !== DeliveryMethod.DELIVERY) {
      throw new BadRequestException('Can only update status for DELIVERY orders');
    }

    if (status === OrderStatus.ON_DELIVERY) {
      // Calculate ETA
      const settings = await this.prisma.systemSetting.findUnique({ where: { id: 1 } });
      const kitchenLat = settings?.kitchenLatitude ?? -7.9666;
      const kitchenLon = settings?.kitchenLongitude ?? 112.6326;

      const baseMinutes = 10;
      const minutesPerKm = 3;
      let distanceKm = 0;

      if (order.address) {
        distanceKm = this.calculateDistance(kitchenLat, kitchenLon, order.address.latitude, order.address.longitude);
      }

      const totalMinutes = baseMinutes + (distanceKm * minutesPerKm);
      
      // Calculate new ETA based on current time
      const eta = new Date();
      eta.setMinutes(eta.getMinutes() + totalMinutes);

      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.ON_DELIVERY,
          estimatedArrival: eta,
        },
      });
      return { id: updatedOrder.id, status: updatedOrder.status, estimatedArrival: updatedOrder.estimatedArrival };

    } else if (status === OrderStatus.DELIVERED) {
      if (!proofOfDelivery) {
        throw new BadRequestException('proofOfDelivery is required when status is DELIVERED');
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          proofOfDelivery,
        },
      });
      return { id: updatedOrder.id, status: updatedOrder.status };
    } else {
      throw new BadRequestException(`Invalid status transition to ${status}`);
    }
  }
}
