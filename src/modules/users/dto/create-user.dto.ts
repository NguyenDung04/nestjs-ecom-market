import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatus } from 'src/common/enums/ecommerce.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'dung@example.com', description: 'Email đăng nhập' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @MaxLength(150, { message: 'Email không được vượt quá 150 ký tự' })
  email!: string;

  @ApiProperty({
    example: 'Nguyễn Trí Dũng',
    description: 'Họ tên người dùng',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Họ tên không được vượt quá 150 ký tự' })
  name!: string;

  @ApiPropertyOptional({
    example: '0378519357',
    description: 'Số điện thoại',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  phone?: string;

  @ApiProperty({ example: '12345678', description: 'Mật khẩu người dùng' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(255, { message: 'Mật khẩu không được vượt quá 255 ký tự' })
  password!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'Ảnh đại diện',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Ảnh đại diện phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh đại diện không được vượt quá 255 ký tự' })
  avatar?: string;

  @ApiPropertyOptional({ example: 3, description: 'ID vai trò' })
  @IsOptional()
  @IsInt({ message: 'ID vai trò phải là số nguyên' })
  roleId?: number;

  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Trạng thái tài khoản',
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái tài khoản không hợp lệ' })
  status?: UserStatus;
}
