import { HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    checkout(checkoutDto: CheckoutDto, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: ({
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                orderId: string;
                louvinInvoiceId: string | null;
                louvinPaymentUrl: string | null;
                amount: import("@prisma/client-runtime-utils").Decimal;
                rawCallbackPayload: import("@prisma/client/runtime/client").JsonValue | null;
                paidAt: Date | null;
            } | null;
            items: {
                id: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                menuId: string;
                orderId: string;
                quantity: number;
                specialNotes: string | null;
            }[];
        } & {
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
        }) | null;
    }>;
    updateStatusByAdmin(id: string, dto: UpdateOrderStatusDto): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    updateStatusByKitchen(id: string): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    updateStatusByDriver(id: string, dto: UpdateOrderStatusDto): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    completeOrderByCustomer(id: string, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
}
