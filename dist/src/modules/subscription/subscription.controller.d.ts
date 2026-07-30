import { HttpStatus } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SkipDayDto } from './dto/skip-day.dto';
import { PauseSubscriptionDto } from './dto/pause-subscription.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    create(createSubscriptionDto: CreateSubscriptionDto, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    getMySubscriptions(req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: ({
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
        })[];
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    skipDay(id: string, skipDayDto: SkipDayDto, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    pause(id: string, pauseDto: PauseSubscriptionDto, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    resume(id: string, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
}
