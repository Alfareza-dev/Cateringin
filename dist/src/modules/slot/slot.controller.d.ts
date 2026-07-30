import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
export declare class SlotController {
    private readonly slotService;
    constructor(slotService: SlotService);
    create(createSlotDto: CreateSlotDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startTime: string;
            endTime: string;
            maxCapacity: number;
            isActive: boolean;
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startTime: string;
            endTime: string;
            maxCapacity: number;
            isActive: boolean;
        }[];
    }>;
    update(id: string, updateSlotDto: UpdateSlotDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startTime: string;
            endTime: string;
            maxCapacity: number;
            isActive: boolean;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            startTime: string;
            endTime: string;
            maxCapacity: number;
            isActive: boolean;
        };
    }>;
}
