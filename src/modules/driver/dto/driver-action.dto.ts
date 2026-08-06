import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class DeliveryQueryDto {
  @ApiProperty({
    description: 'Target delivery date (YYYY-MM-DD)',
    example: '2026-08-05',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Delivery Slot ID to filter by',
    example: 'slot-uuid-1234',
  })
  @IsOptional()
  @IsString()
  slotId?: string;
}

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    description: 'New status for the order (ON_DELIVERY or DELIVERED)',
    enum: [OrderStatus.ON_DELIVERY, OrderStatus.DELIVERED],
    example: OrderStatus.ON_DELIVERY,
  })
  @IsEnum([OrderStatus.ON_DELIVERY, OrderStatus.DELIVERED])
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Proof of Delivery Photo URL (Required if status is DELIVERED)',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsUrl()
  proofOfDelivery?: string;
}
