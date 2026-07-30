import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng Spesial' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Nasi goreng dengan telur, ayam, dan sayuran' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 450 })
  @IsNumber()
  @IsOptional()
  calories?: number;

  @ApiProperty({ example: ['Halal', 'High Protein'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  dietaryTags: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
