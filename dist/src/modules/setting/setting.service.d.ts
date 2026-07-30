import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: number;
        updatedAt: Date;
        kitchenLatitude: number | null;
        kitchenLongitude: number | null;
        maxRadiusKm: number | null;
    }>;
    updateSettings(updateSettingDto: UpdateSettingDto): Promise<{
        id: number;
        updatedAt: Date;
        kitchenLatitude: number | null;
        kitchenLongitude: number | null;
        maxRadiusKm: number | null;
    }>;
}
