import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Email đăng ký tài khoản',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(150, { message: 'Email không được vượt quá 150 ký tự' })
  email!: string;

  @ApiProperty({
    example: 'newuser1',
    description: 'Tên đăng nhập duy nhất của người dùng',
  })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Tên đăng nhập không được vượt quá 50 ký tự' })
  username!: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu đăng ký tài khoản',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
  password!: string;
}
