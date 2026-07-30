import { PrismaService } from '../../prisma/prisma.service';
import { CalculateCartDto } from './dto/calculate-cart.dto';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculate(userId: string, dto: CalculateCartDto): Promise<{
        subtotal: number;
        totalDeliveryFee: number;
        totalPrice: number;
        distanceKm: number;
        dailyDeliveryFee: number;
    }>;
    private calculateHaversineDistance;
}
