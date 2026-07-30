import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: any): Promise<{
        addresses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPrimary: boolean;
            userId: string;
            label: string;
            fullAddress: string;
            note: string | null;
            latitude: number;
            longitude: number;
        }[];
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
