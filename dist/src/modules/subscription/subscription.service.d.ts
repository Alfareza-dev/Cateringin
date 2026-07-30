import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SkipDayDto } from './dto/skip-day.dto';
import { PauseSubscriptionDto } from './dto/pause-subscription.dto';
export declare class SubscriptionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateSubscriptionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        durationDays: number;
        deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
        addressId: string | null;
        slotId: string;
        remainingDays: number;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    findByUser(userId: string): Promise<({
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPrimary: boolean;
            userId: string;
            label: string;
            fullAddress: string;
            note: string | null;
            latitude: number;
            longitude: number;
        } | null;
        slot: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startTime: string;
            endTime: string;
            maxCapacity: number;
            isActive: boolean;
        };
        skips: {
            id: string;
            createdAt: Date;
            skipDate: Date;
            reason: string | null;
            status: import("@prisma/client").$Enums.SkipStatus;
            subscriptionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        durationDays: number;
        deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
        addressId: string | null;
        slotId: string;
        remainingDays: number;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
            addressId: string | null;
            slotId: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            subscriptionId: string | null;
            orderNumber: string;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
            totalPrice: import("@prisma/client-runtime-utils").Decimal;
            notes: string | null;
            estimatedArrival: Date | null;
            proofOfDelivery: string | null;
            pickupPin: string | null;
        }[];
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPrimary: boolean;
            userId: string;
            label: string;
            fullAddress: string;
            note: string | null;
            latitude: number;
            longitude: number;
        } | null;
        slot: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startTime: string;
            endTime: string;
            maxCapacity: number;
            isActive: boolean;
        };
        skips: {
            id: string;
            createdAt: Date;
            skipDate: Date;
            reason: string | null;
            status: import("@prisma/client").$Enums.SkipStatus;
            subscriptionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        durationDays: number;
        deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
        addressId: string | null;
        slotId: string;
        remainingDays: number;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    skipDay(id: string, userId: string, dto: SkipDayDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        durationDays: number;
        deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
        addressId: string | null;
        slotId: string;
        remainingDays: number;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    pause(id: string, userId: string, dto: PauseSubscriptionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        durationDays: number;
        deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
        addressId: string | null;
        slotId: string;
        remainingDays: number;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    resume(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        durationDays: number;
        deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
        addressId: string | null;
        slotId: string;
        remainingDays: number;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    private validateCutOffTime;
}
