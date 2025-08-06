import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePromotionCodeRequestDto {
  @ApiProperty({
    description: 'Promotion code (6 characters)',
    example: 'ABC123',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'Promotion code must be a string' })
  @IsNotEmpty({ message: 'Promotion code is required' })
  @IsString({ message: 'Promotion code must be a string' })
  @IsNotEmpty({ message: 'Promotion code is required' })
  @Min(6, { message: 'Promotion code must be exactly 6 characters' })
  @Max(6, { message: 'Promotion code must be exactly 6 characters' })
  code: string;

  @ApiPropertyOptional({
    description:
      'Maximum number of redemptions for this promotion code. If userEmail is provided, this will always be 1.',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Max redemptions must be a number' })
  @Min(1, { message: 'Max redemptions must be at least 1' })
  @Transform(({ value, obj }) => {
    if (obj && obj.userEmail) {
      return 1;
    }
    return value !== undefined ? parseInt(value, 10) : 1;
  })
  maxRedemptions?: number = 1;

  @ApiPropertyOptional({
    description:
      'Expiration date and time for the promotion code (ISO 8601 format)',
    example: '2024-12-31T23:59:59.000Z',
    type: Date,
    format: 'date-time',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  expiresAt?: Date;

  @ApiProperty({
    description: 'Coupon ID associated with this promotion code',
    example: 'c1a2b3d4-e5f6-7890-abcd-1234567890ef',
  })
  @IsString({ message: 'Coupon ID must be a string' })
  @IsNotEmpty({ message: 'Coupon ID is required' })
  couponId: string;

  @ApiPropertyOptional({
    description:
      'User email to whom this promotion code is assigned (optional)',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString({ message: 'User email must be a string' })
  userEmail?: string;
}
