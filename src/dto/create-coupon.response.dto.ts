import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from 'src/modules/database/entities/coupon.entity';
import Stripe from 'stripe';

export class CreateCouponResponseDto {
  @ApiProperty({
    description: 'Coupon',
  })
  coupon: Coupon;

  @ApiProperty({
    description: 'Stripe coupon',
  })
  stripeCoupon: Stripe.Coupon;
}
