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
exports.SlotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SlotService = class SlotService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSlotDto) {
        return this.prisma.deliverySlot.create({
            data: createSlotDto,
        });
    }
    async findAll() {
        return this.prisma.deliverySlot.findMany({
            orderBy: { startTime: 'asc' },
        });
    }
    async findOne(id) {
        const slot = await this.prisma.deliverySlot.findUnique({
            where: { id },
        });
        if (!slot) {
            throw new common_1.NotFoundException(`DeliverySlot with ID ${id} not found`);
        }
        return slot;
    }
    async update(id, updateSlotDto) {
        await this.findOne(id);
        return this.prisma.deliverySlot.update({
            where: { id },
            data: updateSlotDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.deliverySlot.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.SlotService = SlotService;
exports.SlotService = SlotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SlotService);
//# sourceMappingURL=slot.service.js.map