import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @ApiPropertyOptional({ example: -7.9666, description: 'Kitchen Latitude' })
  @IsNumber()
  @IsOptional()
  kitchenLatitude?: number;

  @ApiPropertyOptional({ example: 112.6326, description: 'Kitchen Longitude' })
  @IsNumber()
  @IsOptional()
  kitchenLongitude?: number;

  @ApiPropertyOptional({ example: 15, description: 'Maximum Delivery Radius in km' })
  @IsNumber()
  @IsOptional()
  maxRadiusKm?: number;
}
