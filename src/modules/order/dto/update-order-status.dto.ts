import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({ description: 'URL bukti pengantaran (untuk driver)' })
  @IsString()
  @IsOptional()
  proofOfDelivery?: string;

  @ApiPropertyOptional({ description: 'Alasan penolakan / pembatalan pesanan (wajib saat status CANCELLED)' })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
