import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    if (createAddressDto.isPrimary) {
      await this.resetPrimaryStatus(userId);
    }

    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(userId, id);

    if (updateAddressDto.isPrimary && !address.isPrimary) {
      await this.resetPrimaryStatus(userId);
    }

    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.address.delete({
      where: { id },
    });
  }

  async setPrimary(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.resetPrimaryStatus(userId);

    return this.prisma.address.update({
      where: { id },
      data: { isPrimary: true },
    });
  }

  private async resetPrimaryStatus(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });
  }
}
