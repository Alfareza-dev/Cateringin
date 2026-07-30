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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
let SubscriptionService = class SubscriptionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        if (dto.deliveryMethod === client_1.DeliveryMethod.DELIVERY && !dto.addressId) {
            throw new common_1.BadRequestException('addressId is required for DELIVERY method');
        }
        const start = dayjs_1.default.tz(dto.startDate, 'Asia/Jakarta').startOf('day');
        const tomorrow = dayjs_1.default.tz(new Date(), 'Asia/Jakarta').add(1, 'day').startOf('day');
        if (start.isBefore(tomorrow)) {
            throw new common_1.BadRequestException('Start date must be at least tomorrow');
        }
        const slot = await this.prisma.deliverySlot.findUnique({
            where: { id: dto.slotId },
        });
        if (!slot || !slot.isActive) {
            throw new common_1.NotFoundException('Delivery slot not found or inactive');
        }
        const endDate = start.add(dto.durationDays - 1, 'day');
        const subscription = await this.prisma.subscription.create({
            data: {
                userId,
                durationDays: dto.durationDays,
                startDate: start.toDate(),
                endDate: endDate.toDate(),
                remainingDays: dto.durationDays,
                status: client_1.SubscriptionStatus.PENDING_PAYMENT,
                deliveryMethod: dto.deliveryMethod,
                addressId: dto.addressId,
                slotId: dto.slotId,
            },
        });
        return subscription;
    }
    async findByUser(userId) {
        return this.prisma.subscription.findMany({
            where: { userId },
            include: {
                skips: true,
                slot: true,
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id, userId },
            include: {
                skips: true,
                slot: true,
                address: true,
                orders: true,
            },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        return subscription;
    }
    async skipDay(id, userId, dto) {
        const subscription = await this.findOne(id, userId);
        if (subscription.status !== client_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active subscriptions can be skipped');
        }
        const targetDate = dayjs_1.default.tz(dto.skipDate, 'Asia/Jakarta').startOf('day');
        this.validateCutOffTime(targetDate.toDate());
        const start = dayjs_1.default.tz(subscription.startDate, 'Asia/Jakarta').startOf('day');
        const end = dayjs_1.default.tz(subscription.endDate, 'Asia/Jakarta').startOf('day');
        if (targetDate.isBefore(start) || targetDate.isAfter(end)) {
            throw new common_1.BadRequestException('Skip date must be within subscription period');
        }
        const existingSkip = await this.prisma.subscriptionSkip.findFirst({
            where: { subscriptionId: id, skipDate: targetDate.toDate(), status: client_1.SkipStatus.APPROVED },
        });
        if (existingSkip) {
            throw new common_1.BadRequestException('Date is already skipped');
        }
        const newEndDate = end.add(1, 'day');
        const [skip, updatedSub] = await this.prisma.$transaction([
            this.prisma.subscriptionSkip.create({
                data: {
                    subscriptionId: id,
                    skipDate: targetDate.toDate(),
                    status: client_1.SkipStatus.APPROVED,
                    reason: dto.reason,
                },
            }),
            this.prisma.subscription.update({
                where: { id },
                data: {
                    endDate: newEndDate.toDate(),
                },
            }),
        ]);
        return updatedSub;
    }
    async pause(id, userId, dto) {
        const subscription = await this.findOne(id, userId);
        if (subscription.status !== client_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active subscriptions can be paused');
        }
        const targetDate = dayjs_1.default.tz(dto.pauseStartDate, 'Asia/Jakarta').startOf('day');
        this.validateCutOffTime(targetDate.toDate());
        const updatedSub = await this.prisma.subscription.update({
            where: { id },
            data: {
                status: client_1.SubscriptionStatus.PAUSED,
            },
        });
        return updatedSub;
    }
    async resume(id, userId) {
        const subscription = await this.findOne(id, userId);
        if (subscription.status !== client_1.SubscriptionStatus.PAUSED) {
            throw new common_1.BadRequestException('Only paused subscriptions can be resumed');
        }
        const now = dayjs_1.default.tz(new Date(), 'Asia/Jakarta');
        const pausedAt = dayjs_1.default.tz(subscription.updatedAt, 'Asia/Jakarta');
        const diffDays = now.diff(pausedAt, 'day');
        const currentEndDate = dayjs_1.default.tz(subscription.endDate, 'Asia/Jakarta');
        const newEndDate = currentEndDate.add(diffDays > 0 ? diffDays : 0, 'day');
        const updatedSub = await this.prisma.subscription.update({
            where: { id },
            data: {
                status: client_1.SubscriptionStatus.ACTIVE,
                endDate: newEndDate.toDate(),
            },
        });
        return updatedSub;
    }
    validateCutOffTime(targetDate) {
        const cutOff = dayjs_1.default.tz(targetDate, 'Asia/Jakarta').subtract(1, 'day').hour(18).minute(0).second(0).millisecond(0);
        const now = dayjs_1.default.tz(new Date(), 'Asia/Jakarta');
        if (now.isAfter(cutOff)) {
            throw new common_1.BadRequestException('Permintaan skip hari gagal: batas waktu maksimal adalah H-1 jam 18:00 WIB.');
        }
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map