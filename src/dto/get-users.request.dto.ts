import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUsersRequestDto {
  @ApiPropertyOptional({
    description: 'User email',
    example: 'erfan@gmail.com',
  })
  @IsString({ message: 'User email must be a string' })
  @IsOptional({ message: 'User email is optional' })
  email: string;
}
