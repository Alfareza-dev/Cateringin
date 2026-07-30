import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
