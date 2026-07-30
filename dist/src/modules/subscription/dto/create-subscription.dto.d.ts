import { DeliveryMethod } from '@prisma/client';
export declare class CreateSubscriptionDto {
    durationDays: number;
    startDate: string;
    deliveryMethod: DeliveryMethod;
    addressId?: string;
    slotId: string;
}
