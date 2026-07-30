import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Rumah' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'Jl. Merdeka No 1, Jakarta' })
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @ApiPropertyOptional({ example: 'Pagar hitam' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: -6.200000 })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ example: 106.816666 })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
