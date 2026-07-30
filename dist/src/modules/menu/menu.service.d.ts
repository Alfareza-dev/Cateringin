import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateMenuScheduleDto } from './dto/create-menu-schedule.dto';
import { BulkCreateMenuScheduleDto } from './dto/bulk-create-menu-schedule.dto';
import { GetMenuFilterDto } from './dto/get-menu-filter.dto';
import { GetScheduleFilterDto } from './dto/get-schedule-filter.dto';
export declare class MenuService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createMenuDto: CreateMenuDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string;
        imageUrl: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        calories: number | null;
        dietaryTags: import("@prisma/client/runtime/client").JsonValue;
    }>;
    findAll(filterDto: GetMenuFilterDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string;
            imageUrl: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            calories: number | null;
            dietaryTags: import("@prisma/client/runtime/client").JsonValue;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string;
        imageUrl: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        calories: number | null;
        dietaryTags: import("@prisma/client/runtime/client").JsonValue;
    }>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string;
        imageUrl: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        calories: number | null;
        dietaryTags: import("@prisma/client/runtime/client").JsonValue;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        description: string;
        imageUrl: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        calories: number | null;
        dietaryTags: import("@prisma/client/runtime/client").JsonValue;
    }>;
    scheduleMenu(createMenuScheduleDto: CreateMenuScheduleDto): Promise<{
        id: string;
        createdAt: Date;
        menuId: string;
        date: Date;
    }>;
    bulkScheduleMenus(bulkDto: BulkCreateMenuScheduleDto): Promise<{
        message: string;
        scheduledCount: number;
    }>;
    getSchedules(filterDto: GetScheduleFilterDto): Promise<Record<string, ({
        menu: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            description: string;
            imageUrl: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            calories: number | null;
            dietaryTags: import("@prisma/client/runtime/client").JsonValue;
        };
    } & {
        id: string;
        createdAt: Date;
        menuId: string;
        date: Date;
    })[]>>;
    removeSchedule(id: string): Promise<{
        id: string;
        createdAt: Date;
        menuId: string;
        date: Date;
    }>;
}
