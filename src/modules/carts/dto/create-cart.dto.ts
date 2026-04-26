import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 1, description: 'ID người dùng sở hữu giỏ hàng' })
  @IsInt({ message: 'ID người dùng phải là số nguyên' })
  userId!: number;
}
