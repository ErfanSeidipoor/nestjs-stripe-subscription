import { ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';

export class GetStripeCheckoutSessionByIdResponseDto {
  @ApiPropertyOptional({
    description: 'Stripe checkout session',
  })
  stripeCheckoutSession: Stripe.Checkout.Session;
}
