import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export enum AnalyticsPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class AnalyticsOverviewQueryDto {
  @ApiPropertyOptional({ enum: AnalyticsPeriod, default: AnalyticsPeriod.MONTHLY })
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod = AnalyticsPeriod.MONTHLY;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class AnalyticsChartsQueryDto {
  @ApiProperty({ enum: AnalyticsPeriod })
  @IsEnum(AnalyticsPeriod)
  period: AnalyticsPeriod;

  @ApiPropertyOptional({ description: 'Year for monthly breakdown' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ description: 'Month (1-12) for daily breakdown within a month' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  month?: number;
}

export class CustomersQueryDto {
  @ApiPropertyOptional({ description: 'Search term for name, email, or phone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class UpdateCustomerStatusDto {
  @ApiProperty({ description: 'Enable or disable account access' })
  @IsBoolean()
  isActive: boolean;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  kitchenLatitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  kitchenLongitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseDeliveryFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  feePerKm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxRadiusKm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessAddress?: string;
}

export class AdminOrdersQueryDto {
  @ApiPropertyOptional({ description: 'Cari berdasarkan nomor pesanan, nama, atau email customer' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Filter status: bisa satu nilai (PAID) atau beberapa dipisah koma (PAID,IN_KITCHEN). Gunakan ALL untuk semua.',
    example: 'PAID,IN_KITCHEN',
  })
  @IsOptional()
  @IsString()
  status?: string; // Akan diparse menjadi array di service

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class BatchUpdateOrderStatusDto {
  @ApiProperty({
    description: 'Daftar ID pesanan yang akan diupdate',
    example: ['0d588506-69d8-4f81-8e9a-5f33f6df2881', 'b3fa73f3-9366-4d24-8186-bceee4c02231'],
  })
  @IsArray()
  @IsString({ each: true })
  orderIds: string[];

  @ApiProperty({
    enum: OrderStatus,
    description: 'Status target untuk pesanan-pesanan tersebut',
    example: OrderStatus.IN_KITCHEN,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Alasan penolakan jika status diubah ke CANCELLED',
    example: 'Kapasitas dapur sudah penuh untuk slot waktu ini',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
