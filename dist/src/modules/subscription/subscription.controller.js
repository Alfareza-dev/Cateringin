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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const subscription_service_1 = require("./subscription.service");
const create_subscription_dto_1 = require("./dto/create-subscription.dto");
const skip_day_dto_1 = require("./dto/skip-day.dto");
const pause_subscription_dto_1 = require("./dto/pause-subscription.dto");
let SubscriptionController = class SubscriptionController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async create(createSubscriptionDto, req) {
        const result = await this.subscriptionService.create(req.user.id, createSubscriptionDto);
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Subscription created successfully',
            data: result,
        };
    }
    async getMySubscriptions(req) {
        const result = await this.subscriptionService.findByUser(req.user.id);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Subscriptions retrieved successfully',
            data: result,
        };
    }
    async findOne(id, req) {
        const result = await this.subscriptionService.findOne(id, req.user.id);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Subscription detail retrieved successfully',
            data: result,
        };
    }
    async skipDay(id, skipDayDto, req) {
        const result = await this.subscriptionService.skipDay(id, req.user.id, skipDayDto);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Skip day processed successfully',
            data: result,
        };
    }
    async pause(id, pauseDto, req) {
        const result = await this.subscriptionService.pause(id, req.user.id, pauseDto);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Subscription paused successfully',
            data: result,
        };
    }
    async resume(id, req) {
        const result = await this.subscriptionService.resume(id, req.user.id);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Subscription resumed successfully',
            data: result,
        };
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Post)('create'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subscription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscription created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscription_dto_1.CreateSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscriptions for logged-in user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getMySubscriptions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail of a specific subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/skip-day'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Skip a specific day in the subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, skip_day_dto_1.SkipDayDto, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "skipDay", null);
__decorate([
    (0, common_1.Post)(':id/pause'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Pause the subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pause_subscription_dto_1.PauseSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "pause", null);
__decorate([
    (0, common_1.Post)(':id/resume'),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resume a paused subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "resume", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Subscription'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('subscription'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map