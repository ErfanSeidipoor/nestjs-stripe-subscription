import { ApiProperty } from '@nestjs/swagger';
import { Coupon, PromotionCode } from 'src/modules/database/entities';
import Stripe from 'stripe';

export class CreatePromotionCodeResponseDto {
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
