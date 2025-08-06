import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductPlanActivationRequestDto {
  @ApiProperty({
    description: 'Indicates if the product plan is active',
    example: true,
  })
  @IsNotEmpty({ message: 'Active status is required' })
  isActive: boolean;
}
