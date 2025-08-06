import { ApiProperty } from '@nestjs/swagger';
import { ProductPlan } from '../modules/database/entities';
import Stripe from 'stripe';

export class GetProductPlansItemResponseDto {
  @ApiProperty({
    description: 'ProductPlan Entities',
    type: ProductPlan,
  })
  productPlan: ProductPlan;

  @ApiProperty({
    description: 'Stripe Product ID',
  })
  stripeProduct: Stripe.Product;

  @ApiProperty({
    description: 'Stripe Price ID',
  })
  stripePrice: Stripe.Price;
}

export class GetProductPlansResponseDto {
  @ApiProperty({
    description: 'ProductPlan Entities',
    type: [GetProductPlansItemResponseDto],
  })
  items: GetProductPlansItemResponseDto[];
}
