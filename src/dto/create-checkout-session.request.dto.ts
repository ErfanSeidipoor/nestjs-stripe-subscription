import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCheckoutSessionRequestDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsString({ message: 'User email must be a string' })
  @IsNotEmpty({ message: 'User email is required' })
  email: string;

  @ApiProperty({
    description: 'Stripe price ID for the subscription plan',
    example: 'price_1OvQkqFdWdWsbnWZqW3JeA4s',
    pattern: '^price_[a-zA-Z0-9]+$',
  })
  @IsString({ message: 'Price ID must be a string' })
  @IsNotEmpty({ message: 'Price ID is required' })
  productPlanId: string;

  @ApiPropertyOptional({
    description: 'Trial period in days',
    example: 14,
    default: 14,
    minimum: 0,
    maximum: 365,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Trial days must be a number' })
  @Min(0, { message: 'Trial days cannot be negative' })
  @Max(365, { message: 'Trial days cannot exceed 365 days' })
  @Transform(({ value }) => parseInt(value, 10))
  trialDays?: number;

  @ApiPropertyOptional({
    description: 'code (6 characters)',
    example: 'ABC123',
    minLength: 6,
    maxLength: 6,
  })
  @IsOptional()
  @IsString({ message: 'code must be a string' })
  @MinLength(6, { message: 'code must be exactly 6 characters' })
  @MaxLength(6, { message: 'code must be exactly 6 characters' })
  code?: string;
}
