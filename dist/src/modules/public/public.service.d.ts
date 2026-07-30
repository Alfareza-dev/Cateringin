import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CoverageCheckDto } from './dto/coverage-check.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GetScheduleFilterDto } from '../menu/dto/get-schedule-filter.dto';
export declare class PublicService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    getActiveMenus(paginationDto: PaginationDto): Promise<{
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
    getActiveSlots(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        startTime: string;
        endTime: string;
        maxCapacity: number;
        isActive: boolean;
    }[]>;
    checkCoverage(coverageCheckDto: CoverageCheckDto): Promise<{
        isCovered: boolean;
        distanceKm: number;
        maxRadiusKm: number;
    }>;
    private calculateHaversineDistance;
    private deg2rad;
}
