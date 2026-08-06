import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class BatchViewQueryDto {
  @ApiProperty({
    description: 'Target fulfillment date (YYYY-MM-DD)',
    example: '2026-08-05',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Delivery Slot ID to filter by',
    example: 'slot-uuid-1234',
  })
  @IsOptional()
  @IsString()
  slotId?: string;
}

export class StartCookingDto {
  @ApiProperty({
    description: 'Target fulfillment date (YYYY-MM-DD)',
    example: '2026-08-05',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Delivery Slot ID to start cooking for',
    example: 'slot-uuid-1234',
  })
  @IsString()
  slotId: string;
}

export class LabelQueryDto {
  @ApiProperty({
    description: 'Target fulfillment date (YYYY-MM-DD)',
    example: '2026-08-05',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Delivery Slot ID to filter by',
    example: 'slot-uuid-1234',
  })
  @IsOptional()
  @IsString()
  slotId?: string;
}
