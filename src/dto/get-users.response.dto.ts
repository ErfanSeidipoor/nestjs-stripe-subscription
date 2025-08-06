import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { User } from '../modules/database/entities';

export class GetUsersItemResponseDto {
  @ApiProperty({
    description: 'User Entities',
    type: User,
  })
  user: User;

  @ApiProperty({
    description: 'Stripe Customer',
  })
  stripeCustomer: Stripe.Customer;
}

export class GetUsersResponseDto {
  @ApiProperty({
    description: 'Users Entities',
    type: [GetUsersItemResponseDto],
  })
  items: GetUsersItemResponseDto[];
}
