import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductPlanRequestDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  @IsString({ message: 'Product name must be a string' })
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Product 1 description',
  })
  @IsString({ message: 'Product description must be a string' })
  @IsNotEmpty({ message: 'Product description is required' })
  @MaxLength(500, {
    message: 'Product description must be less than 500 characters',
  })
  description: string;

  @ApiProperty({
    description: 'Product features',
    example: ['Feature 1', 'Feature 2'],
  })
  @IsArray({ message: 'Product features must be an array' })
  @IsNotEmpty({ message: 'Product features is required' })
  features: string[];

  @ApiProperty({
    description: 'Product price in USD',
    example: 100,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Product price must be a number ' },
  )
  @IsNotEmpty({ message: 'Product price is required' })
  price: number;
}
