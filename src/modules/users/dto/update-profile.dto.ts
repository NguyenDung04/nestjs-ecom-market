import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'user1@example.com',
    description: 'Email mới của tài khoản',
    maxLength: 150,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(150, { message: 'Email không được vượt quá 150 ký tự' })
  email?: string;

  @ApiPropertyOptional({
    example: 'user1_updated',
    description: 'Tên đăng nhập mới của người dùng',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Tên đăng nhập phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Tên đăng nhập không được vượt quá 50 ký tự' })
  username?: string;

  @ApiPropertyOptional({
    example: '654321',
    description: 'Mật khẩu mới của tài khoản',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
  password?: string;
}
