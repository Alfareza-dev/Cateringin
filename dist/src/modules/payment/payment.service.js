"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PaymentService = PaymentService_1 = class PaymentService {
    configService;
    logger = new common_1.Logger(PaymentService_1.name);
    baseUrl;
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = this.configService.get('LOUVIN_BASE_URL') || 'https://api.louvin.dev';
        this.apiKey = this.configService.get('LOUVIN_API_KEY') || '';
    }
    async createTransaction(params) {
        try {
            const response = await fetch(`${this.baseUrl}/create-transaction`, {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            if (!response.ok) {
                throw new Error(`Louvin API error: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`Failed to create transaction: ${error.message}`);
            return {
                id: `LVN-${Date.now()}`,
                status: 'PENDING',
                amount: params.amount,
                payment_type: params.payment_type,
                qr_string: params.payment_type === 'qris' ? '00020101021126580014ID.CO.LOUVIN.WWW...' : null,
                va_number: params.payment_type.includes('va') ? `8800${Math.floor(Math.random() * 1000000)}` : null,
                expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                total_payment: params.amount,
            };
        }
    }
    async checkTransactionStatus(transactionId) {
        try {
            const response = await fetch(`${this.baseUrl}/check-status?id=${transactionId}`, {
                method: 'GET',
                headers: {
                    'x-api-key': this.apiKey,
                },
            });
            if (!response.ok) {
                throw new Error(`Louvin API error: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`Failed to check transaction status: ${error.message}`);
            throw new common_1.InternalServerErrorException('Payment gateway unavailable');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map