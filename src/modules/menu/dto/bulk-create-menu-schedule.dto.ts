import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsDateString, ArrayMinSize } from 'class-validator';

export class BulkCreateMenuScheduleDto {
  @ApiProperty({ example: ['uuid-1', 'uuid-2'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  menuIds: string[];

  @ApiProperty({ example: ['2026-08-01', '2026-08-02'], type: [String] })
  @IsArray()
  @IsDateString({}, { each: true })
  @ArrayMinSize(1)
  dates: string[];
}
