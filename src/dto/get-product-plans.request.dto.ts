import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GetProductPlansRequestDto {
  @ApiPropertyOptional({
    description: 'Set of product plan ids',
  })
  @IsOptional({ message: 'Product plan ids is optional' })
  @IsArray({ message: 'Product plan ids must be an array' })
  @IsNotEmpty({ message: 'Product plan ids is required' })
  @MaxLength(100, { message: 'Product plan ids must be less than 100' })
  productPlanIds: string[];

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'Product 1',
  })
  @IsOptional({ message: 'Search query is optional' })
  @IsString({ message: 'Search query must be a string' })
  search: string;
}
