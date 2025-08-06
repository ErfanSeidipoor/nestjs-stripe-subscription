import { ApiProperty } from '@nestjs/swagger';
import { User } from '../modules/database/entities';
import { Stripe } from 'stripe';

export class CreateUserAndStripeCustomerResponseDto {
  @ApiProperty({
    description: 'User Entity',
    type: User,
  })
  user: User;

  @ApiProperty({
    description: 'Stripe Customer',
  })
  stripeCustomer: Stripe.Customer;
}
