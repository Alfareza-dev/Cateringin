import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class SlotService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSlotDto: CreateSlotDto) {
    return this.prisma.deliverySlot.create({
      data: createSlotDto,
    });
  }

  async findAll() {
    return this.prisma.deliverySlot.findMany({
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const slot = await this.prisma.deliverySlot.findUnique({
      where: { id },
    });
    if (!slot) {
      throw new NotFoundException(`DeliverySlot with ID ${id} not found`);
    }
    return slot;
  }

  async update(id: string, updateSlotDto: UpdateSlotDto) {
    await this.findOne(id);
    return this.prisma.deliverySlot.update({
      where: { id },
      data: updateSlotDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.deliverySlot.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
