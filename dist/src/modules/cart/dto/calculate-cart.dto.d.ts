import { DeliveryMethod } from '@prisma/client';
export declare class CalculateCartDto {
    durationDays: number;
    deliveryMethod: DeliveryMethod;
    addressId?: string;
    slotId: string;
    startDate: string;
}
