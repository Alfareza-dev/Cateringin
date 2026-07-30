import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  @ApiResponse({ status: 201, description: 'Address created' })
  async create(
    @CurrentUser() user: any,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(user.id, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  @ApiResponse({
    status: 200,
    description: 'Return addresses ordered by primary first',
  })
  async findAll(@CurrentUser() user: any) {
    return this.addressService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by id' })
  @ApiResponse({ status: 200, description: 'Return single address' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 200, description: 'Address updated' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(user.id, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  @ApiResponse({ status: 200, description: 'Address deleted' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressService.remove(user.id, id);
  }

  @Patch(':id/primary')
  @ApiOperation({ summary: 'Set address as primary' })
  @ApiResponse({ status: 200, description: 'Address set as primary' })
  async setPrimary(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressService.setPrimary(user.id, id);
  }
}
