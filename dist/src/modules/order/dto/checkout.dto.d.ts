import { DeliveryMethod } from '@prisma/client';
export declare class CheckoutItemDto {
    menuId: string;
    quantity: number;
    specialNotes?: string;
}
export declare class CheckoutDto {
    subscriptionId?: string;
    items?: CheckoutItemDto[];
    deliveryMethod?: DeliveryMethod;
    addressId?: string;
    slotId?: string;
    paymentType: string;
    notes?: string;
}
