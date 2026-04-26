import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: '0b7a5310-3e23-4bb9-a256-825be8c4414a',
    description: 'Mã xác nhận dùng để đặt lại mật khẩu',
  })
  @IsNotEmpty({ message: 'Mã xác nhận không được để trống' })
  @IsString({ message: 'Mã xác nhận phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Mã xác nhận không được vượt quá 255 ký tự' })
  token!: string;

  @ApiProperty({
    example: '654321',
    description: 'Mật khẩu mới',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  @MaxLength(100, { message: 'Mật khẩu mới không được vượt quá 100 ký tự' })
  newPassword!: string;
}
