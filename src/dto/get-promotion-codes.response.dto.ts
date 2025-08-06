import { ApiProperty } from '@nestjs/swagger';
import { Coupon, PromotionCode } from '../modules/database/entities';
import Stripe from 'stripe';

export class GetPromotionCodesItemResponseDto {
  @ApiProperty({
    description: 'Promotion code',
  })
  coupon: Coupon;

  @ApiProperty({
    description: 'Stripe promotion code',
  })
  stripePromotionCode: Stripe.PromotionCode;

  @ApiProperty({
    description: 'Promotion code',
  })
  promotionCode: PromotionCode;
}

export class GetPromotionCodesResponseDto {
  @ApiProperty({
    description: 'Promotion code Entities',
    type: [GetPromotionCodesItemResponseDto],
  })
  items: GetPromotionCodesItemResponseDto[];
}
