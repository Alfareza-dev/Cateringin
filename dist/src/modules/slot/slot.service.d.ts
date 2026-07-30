import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
export declare class SlotService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSlotDto: CreateSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startTime: string;
        endTime: string;
        maxCapacity: number;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startTime: string;
        endTime: string;
        maxCapacity: number;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startTime: string;
        endTime: string;
        maxCapacity: number;
        isActive: boolean;
    }>;
    update(id: string, updateSlotDto: UpdateSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startTime: string;
        endTime: string;
        maxCapacity: number;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startTime: string;
        endTime: string;
        maxCapacity: number;
        isActive: boolean;
    }>;
}
