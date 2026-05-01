/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { Transform } from 'class-transformer';

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

  @ApiPropertyOptional({
    example: 'dien-thoai',
    description:
      'Đường dẫn định danh duy nhất của danh mục. Nếu không truyền, hệ thống sẽ tự tạo từ tên danh mục.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'Đường dẫn danh mục phải là chuỗi ký tự' })
  @MaxLength(150, {
    message: 'Đường dẫn danh mục không được vượt quá 150 ký tự',
  })
  slug?: string;

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
    example: 'categories/phone.png',
    description: 'Ảnh danh mục',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Ảnh danh mục phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh danh mục không được vượt quá 255 ký tự' })
  image?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID danh mục cha nếu có. Nếu null thì là danh mục cấp 1.',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      value === 'null' ||
      value === 'undefined'
    ) {
      return null;
    }

    return Number(value);
  })
  @IsInt({ message: 'ID danh mục cha phải là số nguyên' })
  @Min(1, { message: 'ID danh mục cha phải lớn hơn 0' })
  parentId?: number | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của danh mục',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === '1' || value === 1) {
      return true;
    }

    if (value === false || value === 'false' || value === '0' || value === 0) {
      return false;
    }

    return value;
  })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là đúng hoặc sai' })
  isActive?: boolean;
}
