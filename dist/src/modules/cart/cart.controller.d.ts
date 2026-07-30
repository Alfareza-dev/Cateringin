import { HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { CalculateCartDto } from './dto/calculate-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    calculate(calculateCartDto: CalculateCartDto, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            subtotal: number;
            totalDeliveryFee: number;
            totalPrice: number;
            distanceKm: number;
            dailyDeliveryFee: number;
        };
    }>;
}
