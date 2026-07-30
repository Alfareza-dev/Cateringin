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
exports.CheckoutDto = exports.CheckoutItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CheckoutItemDto {
    menuId;
    quantity;
    specialNotes;
}
exports.CheckoutItemDto = CheckoutItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckoutItemDto.prototype, "menuId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CheckoutItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutItemDto.prototype, "specialNotes", void 0);
class CheckoutDto {
    subscriptionId;
    items;
    deliveryMethod;
    addressId;
    slotId;
    paymentType;
    notes;
}
exports.CheckoutDto = CheckoutDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the subscription if checking out for a subscription' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "subscriptionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CheckoutItemDto], description: 'Items to order if not checking out a subscription' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CheckoutItemDto),
    __metadata("design:type", Array)
], CheckoutDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.DeliveryMethod }),
    (0, class_validator_1.IsEnum)(client_1.DeliveryMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "addressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "slotId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment type such as qris, gopay, shopeepay, bni_va, etc.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "notes", void 0);
//# sourceMappingURL=checkout.dto.js.map