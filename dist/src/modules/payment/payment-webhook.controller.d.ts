import { PrismaService } from '../../prisma/prisma.service';
export declare class PaymentWebhookController {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleCallback(body: any): Promise<{
        received: boolean;
    }>;
}
