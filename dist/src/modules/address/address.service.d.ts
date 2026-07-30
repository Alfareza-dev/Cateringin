import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createAddressDto: CreateAddressDto): Promise<{
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
    }>;
    findAll(userId: string): Promise<{
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
    }[]>;
    findOne(userId: string, id: string): Promise<{
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
    }>;
    update(userId: string, id: string, updateAddressDto: UpdateAddressDto): Promise<{
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
    }>;
    remove(userId: string, id: string): Promise<{
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
    }>;
    setPrimary(userId: string, id: string): Promise<{
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
    }>;
    private resetPrimaryStatus;
}
