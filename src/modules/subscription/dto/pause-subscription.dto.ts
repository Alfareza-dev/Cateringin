import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PauseSubscriptionDto {
  @ApiProperty({ description: 'Date to start pausing (YYYY-MM-DD)', example: '2026-08-05' })
  @IsString()
  @IsNotEmpty()
  pauseStartDate: string;
}
