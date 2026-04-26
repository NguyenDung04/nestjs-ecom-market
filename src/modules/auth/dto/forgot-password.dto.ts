import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'admin1@example.com',
    description: 'Email dùng để yêu cầu đặt lại mật khẩu',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(150, { message: 'Email không được vượt quá 150 ký tự' })
  email!: string;
}
