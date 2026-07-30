import { ConfigService } from '@nestjs/config';
export interface CreateTransactionParams {
    amount: number;
    payment_type: string;
    customer_name: string;
    customer_email: string;
    description: string;
    reference: string;
}
export declare class PaymentService {
    private readonly configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly apiKey;
    constructor(configService: ConfigService);
    createTransaction(params: CreateTransactionParams): Promise<any>;
    checkTransactionStatus(transactionId: string): Promise<any>;
}
