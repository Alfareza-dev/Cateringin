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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_service_1 = require("./order.service");
const checkout_dto_1 = require("./dto/checkout.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async checkout(checkoutDto, req) {
        const result = await this.orderService.checkout(req.user.id, checkoutDto);
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Checkout successful',
            data: result,
        };
    }
    async updateStatusByAdmin(id, dto) {
        const result = await this.orderService.updateStatusByAdmin(id, dto);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Order status updated by Admin',
            data: result,
        };
    }
    async updateStatusByKitchen(id) {
        const result = await this.orderService.updateStatusByKitchen(id);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Order status updated to IN_KITCHEN',
            data: result,
        };
    }
    async updateStatusByDriver(id, dto) {
        const result = await this.orderService.updateStatusByDriver(id, dto);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: `Order status updated to ${dto.status}`,
            data: result,
        };
    }
    async completeOrderByCustomer(id, req) {
        const result = await this.orderService.completeOrderByCustomer(id, req.user.id);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Order completed by Customer',
            data: result,
        };
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('order/checkout'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Checkout an order or subscription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order checked out and payment created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_dto_1.CheckoutDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "checkout", null);
__decorate([
    (0, common_1.Patch)('admin/orders/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Update order status arbitrarily' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatusByAdmin", null);
__decorate([
    (0, common_1.Patch)('kitchen/orders/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.KITCHEN, client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Kitchen: Mark order as IN_KITCHEN' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatusByKitchen", null);
__decorate([
    (0, common_1.Patch)('driver/orders/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Driver: Mark order as ON_DELIVERY or DELIVERED' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatusByDriver", null);
__decorate([
    (0, common_1.Patch)('user/orders/:id/complete'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Customer: Confirm order is COMPLETED' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "completeOrderByCustomer", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Order'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map