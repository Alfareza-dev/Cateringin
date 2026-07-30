import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateMenuScheduleDto } from './dto/create-menu-schedule.dto';
import { BulkCreateMenuScheduleDto } from './dto/bulk-create-menu-schedule.dto';
import { GetMenuFilterDto } from './dto/get-menu-filter.dto';
import { GetScheduleFilterDto } from './dto/get-schedule-filter.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(createMenuDto: CreateMenuDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
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
        };
    }>;
    findAll(filterDto: GetMenuFilterDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
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
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
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
        };
    }>;
    update(id: string, updateMenuDto: UpdateMenuDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
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
            isActive: boolean;
            description: string;
            imageUrl: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            calories: number | null;
            dietaryTags: import("@prisma/client/runtime/client").JsonValue;
        };
    }>;
    scheduleMenu(createMenuScheduleDto: CreateMenuScheduleDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            menuId: string;
            date: Date;
        };
    }>;
    bulkScheduleMenus(bulkDto: BulkCreateMenuScheduleDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            message: string;
            scheduledCount: number;
        };
    }>;
    getSchedules(filterDto: GetScheduleFilterDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Record<string, ({
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
        })[]>;
    }>;
    removeSchedule(id: string): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            menuId: string;
            date: Date;
        };
    }>;
}
