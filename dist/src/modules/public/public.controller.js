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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_service_1 = require("./public.service");
const coverage_check_dto_1 = require("./dto/coverage-check.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const get_schedule_filter_dto_1 = require("../menu/dto/get-schedule-filter.dto");
let PublicController = class PublicController {
    publicService;
    constructor(publicService) {
        this.publicService = publicService;
    }
    async getActiveMenus(paginationDto) {
        const data = await this.publicService.getActiveMenus(paginationDto);
        return { success: true, statusCode: 200, message: 'Active menus retrieved successfully', data };
    }
    async getSchedules(filterDto) {
        const data = await this.publicService.getSchedules(filterDto);
        return { success: true, statusCode: 200, message: 'Schedules retrieved successfully', data };
    }
    async getActiveSlots() {
        const data = await this.publicService.getActiveSlots();
        return { success: true, statusCode: 200, message: 'Active slots retrieved successfully', data };
    }
    async checkCoverage(coverageCheckDto) {
        const data = await this.publicService.checkCoverage(coverageCheckDto);
        return { success: true, statusCode: 200, message: 'Coverage checked successfully', data };
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)('menus/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active menus for public catalog' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getActiveMenus", null);
__decorate([
    (0, common_1.Get)('schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active menu schedules for customer calendar' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_schedule_filter_dto_1.GetScheduleFilterDto]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Get)('slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active delivery slots' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getActiveSlots", null);
__decorate([
    (0, common_1.Post)('coverage-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check delivery coverage using Haversine formula' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coverage_check_dto_1.CoverageCheckDto]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "checkCoverage", null);
exports.PublicController = PublicController = __decorate([
    (0, swagger_1.ApiTags)('Public Catalog & Coverage'),
    (0, common_1.Controller)('public'),
    __metadata("design:paramtypes", [public_service_1.PublicService])
], PublicController);
//# sourceMappingURL=public.controller.js.map