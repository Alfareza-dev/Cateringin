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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateCartDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CalculateCartDto {
    durationDays;
    deliveryMethod;
    addressId;
    slotId;
    startDate;
}
exports.CalculateCartDto = CalculateCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration of the subscription in days', example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CalculateCartDto.prototype, "durationDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DeliveryMethod, description: 'Delivery method' }),
    (0, class_validator_1.IsEnum)(client_1.DeliveryMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateCartDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address ID required if deliveryMethod is DELIVERY', required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.deliveryMethod === client_1.DeliveryMethod.DELIVERY),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateCartDto.prototype, "addressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery Slot ID', required: true }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateCartDto.prototype, "slotId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subscription start date (YYYY-MM-DD)', example: '2026-08-01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CalculateCartDto.prototype, "startDate", void 0);
//# sourceMappingURL=calculate-cart.dto.js.map