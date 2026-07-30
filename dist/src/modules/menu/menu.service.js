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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMenuDto) {
        return this.prisma.menu.create({
            data: createMenuDto,
        });
    }
    async findAll(filterDto) {
        const { search, isActive, page = 1, limit = 10 } = filterDto;
        const where = {};
        if (search) {
            where.name = { contains: search };
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.menu.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.menu.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${id} not found`);
        }
        return menu;
    }
    async update(id, updateMenuDto) {
        await this.findOne(id);
        return this.prisma.menu.update({
            where: { id },
            data: updateMenuDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.menu.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async scheduleMenu(createMenuScheduleDto) {
        const { menuId, date } = createMenuScheduleDto;
        const dateObj = new Date(date);
        await this.findOne(menuId);
        const existing = await this.prisma.dailyMenuSchedule.findFirst({
            where: {
                menuId,
                date: dateObj,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Menu is already scheduled for ${date}`);
        }
        return this.prisma.dailyMenuSchedule.create({
            data: {
                menuId,
                date: dateObj,
            },
        });
    }
    async bulkScheduleMenus(bulkDto) {
        const { menuIds, dates } = bulkDto;
        const menus = await this.prisma.menu.findMany({
            where: { id: { in: menuIds } },
        });
        if (menus.length !== menuIds.length) {
            throw new common_1.NotFoundException('One or more menus not found');
        }
        const payload = [];
        for (const menuId of menuIds) {
            for (const dateStr of dates) {
                const dateObj = new Date(dateStr);
                payload.push({ menuId, date: dateObj });
            }
        }
        const allExisting = await this.prisma.dailyMenuSchedule.findMany({
            where: {
                menuId: { in: menuIds },
                date: { in: dates.map(d => new Date(d)) },
            },
        });
        const existingSet = new Set(allExisting.map(e => `${e.menuId}_${e.date.toISOString().split('T')[0]}`));
        const filteredPayload = payload.filter(p => !existingSet.has(`${p.menuId}_${p.date.toISOString().split('T')[0]}`));
        if (filteredPayload.length > 0) {
            await this.prisma.dailyMenuSchedule.createMany({
                data: filteredPayload,
            });
        }
        return {
            message: `Successfully scheduled ${filteredPayload.length} items. Skipped ${payload.length - filteredPayload.length} duplicates.`,
            scheduledCount: filteredPayload.length,
        };
    }
    async getSchedules(filterDto) {
        const { startDate, endDate } = filterDto;
        const where = {};
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        else if (startDate) {
            where.date = { gte: new Date(startDate) };
        }
        else if (endDate) {
            where.date = { lte: new Date(endDate) };
        }
        const schedules = await this.prisma.dailyMenuSchedule.findMany({
            where,
            include: {
                menu: true,
            },
            orderBy: { date: 'asc' },
        });
        const grouped = schedules.reduce((acc, curr) => {
            const dateKey = curr.date.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(curr);
            return acc;
        }, {});
        return grouped;
    }
    async removeSchedule(id) {
        const schedule = await this.prisma.dailyMenuSchedule.findUnique({
            where: { id },
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Schedule with ID ${id} not found`);
        }
        return this.prisma.dailyMenuSchedule.delete({
            where: { id },
        });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map