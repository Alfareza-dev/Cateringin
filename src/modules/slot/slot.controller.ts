import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin Delivery Slots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery slot' })
  async create(@Body() createSlotDto: CreateSlotDto) {
    const data = await this.slotService.create(createSlotDto);
    return { success: true, statusCode: 201, message: 'Slot created successfully', data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all delivery slots' })
  async findAll() {
    const data = await this.slotService.findAll();
    return { success: true, statusCode: 200, message: 'Slots retrieved successfully', data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a delivery slot' })
  async update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    const data = await this.slotService.update(id, updateSlotDto);
    return { success: true, statusCode: 200, message: 'Slot updated successfully', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a delivery slot' })
  async remove(@Param('id') id: string) {
    const data = await this.slotService.remove(id);
    return { success: true, statusCode: 200, message: 'Slot deleted successfully', data };
  }
}
