import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Matches,
} from 'class-validator';

export class CreateSlotDto {
  @ApiProperty({ example: 'Morning Batch 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '06:30', description: 'Format HH:mm' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '08:00', description: 'Format HH:mm' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxCapacity?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
