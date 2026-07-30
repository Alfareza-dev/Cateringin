import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SkipDayDto {
  @ApiProperty({ description: 'Date to skip (YYYY-MM-DD)', example: '2026-08-05' })
  @IsString()
  @IsNotEmpty()
  skipDate: string;

  @ApiProperty({ description: 'Reason for skipping', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
