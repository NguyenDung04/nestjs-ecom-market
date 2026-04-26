import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 1, description: 'ID người dùng' })
  @IsInt({ message: 'ID người dùng phải là số nguyên' })
  userId!: number;

  @ApiProperty({
    example: 'Nguyễn Trí Dũng',
    description: 'Tên người nhận',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  @IsString({ message: 'Tên người nhận phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Tên người nhận không được vượt quá 150 ký tự' })
  receiverName!: string;

  @ApiProperty({
    example: '0378519357',
    description: 'Số điện thoại người nhận',
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Số điện thoại người nhận không được để trống' })
  @IsString({ message: 'Số điện thoại người nhận phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự' })
  receiverPhone!: string;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'Tỉnh/thành phố',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  province!: string;

  @ApiProperty({
    example: 'Cầu Giấy',
    description: 'Quận/huyện',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  district!: string;

  @ApiProperty({
    example: 'Dịch Vọng',
    description: 'Phường/xã',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  ward!: string;

  @ApiProperty({
    example: 'Số 1 Xuân Thủy',
    description: 'Địa chỉ chi tiết',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  addressDetail!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Địa chỉ mặc định',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
