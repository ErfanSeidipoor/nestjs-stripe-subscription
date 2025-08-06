import { ApiProperty } from '@nestjs/swagger';
import { ProductPlan } from '../modules/database/entities';
import Stripe from 'stripe';

export class UpdateProductPlanActivationResponseDto {
  @ApiProperty({
    description: 'ProductPlan Entity',
    type: ProductPlan,
  })
  productPlan: ProductPlan;

  @ApiProperty({
    description: 'Stripe Product ID',
    type: String,
  })
  stripeProduct: Stripe.Product;

  @ApiProperty({
    description: 'Stripe Product ID',
    type: String,
  })
  stripePrice: Stripe.Price;
}
