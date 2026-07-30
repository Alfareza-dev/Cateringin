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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_service_1 = require("./menu.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const create_menu_schedule_dto_1 = require("./dto/create-menu-schedule.dto");
const bulk_create_menu_schedule_dto_1 = require("./dto/bulk-create-menu-schedule.dto");
const get_menu_filter_dto_1 = require("./dto/get-menu-filter.dto");
const get_schedule_filter_dto_1 = require("./dto/get-schedule-filter.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let MenuController = class MenuController {
    menuService;
    constructor(menuService) {
        this.menuService = menuService;
    }
    async create(createMenuDto) {
        const data = await this.menuService.create(createMenuDto);
        return { success: true, statusCode: 201, message: 'Menu created successfully', data };
    }
    async findAll(filterDto) {
        const data = await this.menuService.findAll(filterDto);
        return { success: true, statusCode: 200, message: 'Menus retrieved successfully', data };
    }
    async findOne(id) {
        const data = await this.menuService.findOne(id);
        return { success: true, statusCode: 200, message: 'Menu retrieved successfully', data };
    }
    async update(id, updateMenuDto) {
        const data = await this.menuService.update(id, updateMenuDto);
        return { success: true, statusCode: 200, message: 'Menu updated successfully', data };
    }
    async remove(id) {
        const data = await this.menuService.remove(id);
        return { success: true, statusCode: 200, message: 'Menu deleted successfully', data };
    }
    async scheduleMenu(createMenuScheduleDto) {
        const data = await this.menuService.scheduleMenu(createMenuScheduleDto);
        return { success: true, statusCode: 201, message: 'Menu scheduled successfully', data };
    }
    async bulkScheduleMenus(bulkDto) {
        const data = await this.menuService.bulkScheduleMenus(bulkDto);
        return { success: true, statusCode: 201, message: data.message, data };
    }
    async getSchedules(filterDto) {
        const data = await this.menuService.getSchedules(filterDto);
        return { success: true, statusCode: 200, message: 'Menu schedules retrieved successfully', data };
    }
    async removeSchedule(id) {
        const data = await this.menuService.removeSchedule(id);
        return { success: true, statusCode: 200, message: 'Menu schedule deleted successfully', data };
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Post)('menus'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new menu' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('menus'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all menus with filters and pagination' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_menu_filter_dto_1.GetMenuFilterDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('menus/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get menu by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('menus/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a menu' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('menus/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a menu' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('menu-schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule a menu for a specific date' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_schedule_dto_1.CreateMenuScheduleDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "scheduleMenu", null);
__decorate([
    (0, common_1.Post)('menu-schedules/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk schedule menus across multiple dates' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_menu_schedule_dto_1.BulkCreateMenuScheduleDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "bulkScheduleMenus", null);
__decorate([
    (0, common_1.Get)('menu-schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get menu schedules filtered by date range' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_schedule_filter_dto_1.GetScheduleFilterDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Delete)('menu-schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a scheduled menu' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "removeSchedule", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('Admin Menu & Scheduler'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map