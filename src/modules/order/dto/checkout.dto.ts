import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeliveryMethod } from '@prisma/client';

export class CheckoutItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  menuId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialNotes?: string;
}

export class CheckoutDto {
  @ApiPropertyOptional({
    description: 'ID of the subscription if checking out for a subscription',
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @ApiPropertyOptional({
    type: [CheckoutItemDto],
    description: 'Items to order if not checking out a subscription',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items?: CheckoutItemDto[];

  @ApiPropertyOptional({ enum: DeliveryMethod })
  @IsEnum(DeliveryMethod)
  @IsOptional()
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slotId?: string;

  @ApiProperty({
    description: 'Payment type such as qris, gopay, shopeepay, bni_va, etc.',
  })
  @IsString()
  @IsNotEmpty()
  paymentType: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
