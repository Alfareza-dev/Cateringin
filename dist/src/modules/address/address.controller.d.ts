import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    create(user: any, createAddressDto: CreateAddressDto): Promise<{
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
    findAll(user: any): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
    update(user: any, id: string, updateAddressDto: UpdateAddressDto): Promise<{
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
    remove(user: any, id: string): Promise<{
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
    setPrimary(user: any, id: string): Promise<{
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
}
