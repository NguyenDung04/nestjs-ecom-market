import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @IsInt({ message: 'ID sản phẩm phải là số nguyên' })
  productId!: number;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Đường dẫn ảnh sản phẩm',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Đường dẫn ảnh không được để trống' })
  @IsString({ message: 'Đường dẫn ảnh phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Đường dẫn ảnh không được vượt quá 255 ký tự' })
  imageUrl!: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự hiển thị ảnh',
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Thứ tự hiển thị phải là số nguyên' })
  @Min(0, { message: 'Thứ tự hiển thị không được âm' })
  sortOrder?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Ảnh chính của sản phẩm',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ảnh chính phải là đúng hoặc sai' })
  isPrimary?: boolean;
}
