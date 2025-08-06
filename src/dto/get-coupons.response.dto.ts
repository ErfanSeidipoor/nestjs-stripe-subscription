import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from '../modules/database/entities';
import Stripe from 'stripe';

export class GetCouponsItemResponseDto {
  @ApiProperty({
    description: 'Coupon Entities',
    type: Coupon,
  })
  coupon: Coupon;

  @ApiProperty({
    description: 'Stripe Coupon',
  })
  stripeCoupon: Stripe.Coupon;
}

export class GetCouponsResponseDto {
  @ApiProperty({
    description: 'Coupon Entities',
    type: [GetCouponsItemResponseDto],
  })
  items: GetCouponsItemResponseDto[];
}
