import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateMenuScheduleDto {
  @ApiProperty({ example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  menuId: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  date: string;
}
