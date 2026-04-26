import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Điện thoại',
    description: 'Tên danh mục sản phẩm',
    maxLength: 120,
  })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString({ message: 'Tên danh mục phải là chuỗi ký tự' })
  @MaxLength(120, { message: 'Tên danh mục không được vượt quá 120 ký tự' })
  name!: string;

  @ApiProperty({
    example: 'dien-thoai',
    description: 'Đường dẫn định danh duy nhất của danh mục',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'Đường dẫn danh mục không được để trống' })
  @IsString({ message: 'Đường dẫn danh mục phải là chuỗi ký tự' })
  @MaxLength(150, {
    message: 'Đường dẫn danh mục không được vượt quá 150 ký tự',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'Danh mục điện thoại và phụ kiện liên quan',
    description: 'Mô tả ngắn về danh mục',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả danh mục phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Mô tả danh mục không được vượt quá 255 ký tự' })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/category.png',
    description: 'Ảnh danh mục',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Ảnh danh mục phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh danh mục không được vượt quá 255 ký tự' })
  image?: string;

  @ApiPropertyOptional({ example: null, description: 'ID danh mục cha nếu có' })
  @IsOptional()
  @IsInt({ message: 'ID danh mục cha phải là số nguyên' })
  parentId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của danh mục',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là đúng hoặc sai' })
  isActive?: boolean;
}
