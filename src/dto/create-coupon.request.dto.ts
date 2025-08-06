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

export class CreateCouponRequestDto {
  @ApiProperty({
    description: 'Coupon name',
    example: 'SUMMER2024',
  })
  @IsString({ message: 'Coupon name must be a string' })
  @IsNotEmpty({ message: 'Coupon name is required' })
  name: string;

  @ApiProperty({
    description: 'Percentage off for the coupon',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Percent off must be a number' })
  @Min(1, { message: 'Percent off must be at least 1' })
  @Max(100, { message: 'Percent off cannot exceed 100' })
  @Transform(({ value }) => parseInt(value, 10))
  percentOff: number;

  @ApiProperty({
    description:
      "Duration of the coupon. Can be 'once', 'repeating', or 'forever'",
    example: 'repeating',
    enum: ['once', 'repeating', 'forever'],
  })
  @IsString({ message: 'Duration must be a string' })
  @IsNotEmpty({ message: 'Duration is required' })
  duration: 'once' | 'repeating' | 'forever';

  @ApiPropertyOptional({
    description: 'Duration in months (required if duration is repeating)',
    example: 3,
    minimum: 1,
    maximum: 36,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Duration in months must be a number' })
  @Min(1, { message: 'Duration in months must be at least 1' })
  @Max(36, { message: 'Duration in months cannot exceed 36' })
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  durationInMonths?: number;
}
