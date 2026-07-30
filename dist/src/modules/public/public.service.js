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
exports.PublicService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublicService = class PublicService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async getActiveMenus(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.menu.findMany({
                where: { isActive: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.menu.count({ where: { isActive: true } }),
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
    async getSchedules(filterDto) {
        const { startDate, endDate } = filterDto;
        const where = {
            menu: {
                isActive: true,
            },
        };
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
    async getActiveSlots() {
        return this.prisma.deliverySlot.findMany({
            where: { isActive: true },
            orderBy: { startTime: 'asc' },
        });
    }
    async checkCoverage(coverageCheckDto) {
        const { latitude, longitude } = coverageCheckDto;
        const kitchenLat = this.configService.get('KITCHEN_LATITUDE') || -7.9666;
        const kitchenLon = this.configService.get('KITCHEN_LONGITUDE') || 112.6326;
        const maxRadiusKm = this.configService.get('MAX_RADIUS_KM') || 15;
        const distanceKm = this.calculateHaversineDistance(kitchenLat, kitchenLon, latitude, longitude);
        return {
            isCovered: distanceKm <= maxRadiusKm,
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            maxRadiusKm,
        };
    }
    calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.PublicService = PublicService;
exports.PublicService = PublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PublicService);
//# sourceMappingURL=public.service.js.map