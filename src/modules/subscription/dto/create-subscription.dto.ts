import { ApiProperty } from '@nestjs/swagger';
import { DeliveryMethod } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Duration of the subscription in days',
    example: 5,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  durationDays: number;

  @ApiProperty({
    description: 'Subscription start date (YYYY-MM-DD)',
    example: '2026-08-01',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ enum: DeliveryMethod, description: 'Delivery method' })
  @IsEnum(DeliveryMethod)
  @IsNotEmpty()
  deliveryMethod: DeliveryMethod;

  @ApiProperty({
    description: 'Address ID required if deliveryMethod is DELIVERY',
    required: false,
  })
  @ValidateIf((o) => o.deliveryMethod === DeliveryMethod.DELIVERY)
  @IsUUID()
  @IsNotEmpty()
  addressId?: string;

  @ApiProperty({ description: 'Delivery Slot ID', required: true })
  @IsUUID()
  @IsNotEmpty()
  slotId: string;
}
