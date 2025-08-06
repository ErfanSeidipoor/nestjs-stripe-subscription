import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

export class CreateCheckoutSessionResponseDto {
  @ApiProperty({
    description: 'Stripe checkout session ID',
  })
  stripeCheckoutSession: Stripe.Checkout.Session;
}
