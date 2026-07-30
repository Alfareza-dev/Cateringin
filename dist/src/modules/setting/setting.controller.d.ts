import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    getSettings(): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: number;
            updatedAt: Date;
            kitchenLatitude: number | null;
            kitchenLongitude: number | null;
            maxRadiusKm: number | null;
        };
    }>;
    updateSettings(updateSettingDto: UpdateSettingDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: number;
            updatedAt: Date;
            kitchenLatitude: number | null;
            kitchenLongitude: number | null;
            maxRadiusKm: number | null;
        };
    }>;
}
