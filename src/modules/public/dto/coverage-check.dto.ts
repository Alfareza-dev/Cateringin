import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CoverageCheckDto {
  @ApiProperty({ example: -7.9666, description: 'Latitude' })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ example: 112.6326, description: 'Longitude' })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
