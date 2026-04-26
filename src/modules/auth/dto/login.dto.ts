import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin1@example.com',
    description: 'Email đã đăng ký của người dùng',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(150, { message: 'Email không được vượt quá 150 ký tự' })
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu của người dùng',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
  password!: string;
}
