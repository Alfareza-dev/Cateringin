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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculate(userId, dto) {
        if (dto.deliveryMethod === client_1.DeliveryMethod.DELIVERY && !dto.addressId) {
            throw new common_1.BadRequestException('addressId is required for DELIVERY method');
        }
        const slot = await this.prisma.deliverySlot.findUnique({
            where: { id: dto.slotId },
        });
        if (!slot || !slot.isActive) {
            throw new common_1.NotFoundException('Delivery slot not found or inactive');
        }
        let distanceKm = 0;
        let dailyDeliveryFee = 0;
        if (dto.deliveryMethod === client_1.DeliveryMethod.DELIVERY) {
            const address = await this.prisma.address.findFirst({
                where: { id: dto.addressId, userId },
            });
            if (!address) {
                throw new common_1.NotFoundException('Address not found');
            }
            const setting = await this.prisma.systemSetting.findFirst();
            if (!setting || !setting.kitchenLatitude || !setting.kitchenLongitude) {
                throw new common_1.BadRequestException('Kitchen location is not configured by admin');
            }
            distanceKm = this.calculateHaversineDistance(setting.kitchenLatitude, setting.kitchenLongitude, address.latitude, address.longitude);
            if (setting.maxRadiusKm && distanceKm > setting.maxRadiusKm) {
                throw new common_1.BadRequestException(`Delivery address exceeds maximum radius of ${setting.maxRadiusKm} km`);
            }
            const baseFee = setting.baseDeliveryFee ? Number(setting.baseDeliveryFee) : 5000;
            const feePerKm = setting.feePerKm ? Number(setting.feePerKm) : 2000;
            dailyDeliveryFee = baseFee + distanceKm * feePerKm;
        }
        let totalMenuPrice = 0;
        const start = (0, dayjs_1.default)(dto.startDate);
        const activeMenus = await this.prisma.menu.findMany({
            where: { isActive: true },
            select: { price: true },
        });
        let fallbackPrice = 0;
        if (activeMenus.length > 0) {
            const sum = activeMenus.reduce((acc, menu) => acc + Number(menu.price), 0);
            fallbackPrice = sum / activeMenus.length;
        }
        for (let i = 0; i < dto.durationDays; i++) {
            const currentDate = start.add(i, 'day').toDate();
            const schedule = await this.prisma.dailyMenuSchedule.findFirst({
                where: { date: currentDate },
                include: { menu: true },
            });
            if (schedule && schedule.menu) {
                totalMenuPrice += Number(schedule.menu.price);
            }
            else {
                totalMenuPrice += fallbackPrice;
            }
        }
        const totalDeliveryFee = dailyDeliveryFee * dto.durationDays;
        const totalPrice = totalMenuPrice + totalDeliveryFee;
        return {
            subtotal: totalMenuPrice,
            totalDeliveryFee,
            totalPrice,
            distanceKm: Number(distanceKm.toFixed(2)),
            dailyDeliveryFee,
        };
    }
    calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map