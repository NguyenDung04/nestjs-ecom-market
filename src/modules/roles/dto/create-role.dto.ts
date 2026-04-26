import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Tên vai trò', maxLength: 60 })
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @IsString({ message: 'Tên vai trò phải là chuỗi ký tự' })
  @MaxLength(60, { message: 'Tên vai trò không được vượt quá 60 ký tự' })
  name!: string;

  @ApiPropertyOptional({
    example: 'Quản trị viên hệ thống',
    description: 'Mô tả vai trò',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả vai trò phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Mô tả vai trò không được vượt quá 255 ký tự' })
  description?: string;
}
