import { PublicService } from './public.service';
import { CoverageCheckDto } from './dto/coverage-check.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GetScheduleFilterDto } from '../menu/dto/get-schedule-filter.dto';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    getActiveMenus(paginationDto: PaginationDto): Promise<{
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
    getActiveSlots(): Promise<{
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
    checkCoverage(coverageCheckDto: CoverageCheckDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            isCovered: boolean;
            distanceKm: number;
            maxRadiusKm: number;
        };
    }>;
}
