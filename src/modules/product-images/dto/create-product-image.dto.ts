import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

function emptyToUndefined(value: unknown) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    value === 'null' ||
    value === 'undefined'
  ) {
    return undefined;
  }

  return value;
}

function optionalNumber(value: unknown) {
  const normalizedValue = emptyToUndefined(value);

  if (normalizedValue === undefined) {
    return undefined;
  }

  return Number(normalizedValue);
}

function optionalBoolean(value: unknown) {
  if (value === true || value === 'true' || value === '1' || value === 1) {
    return true;
  }

  if (value === false || value === 'false' || value === '0' || value === 0) {
    return false;
  }

  return undefined;
}

export class CreateProductImageDto {
  @ApiPropertyOptional({
    example: 'uploads/products/gallery/product-gallery-1710000000000.jpg',
    description:
      'Đường dẫn ảnh phụ. Khi upload file, hệ thống sẽ tự tạo imageUrl.',
    maxLength: 255,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString({ message: 'Ảnh sản phẩm phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh sản phẩm không được vượt quá 255 ký tự' })
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự hiển thị ảnh',
    default: 0,
  })
  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsInt({ message: 'Thứ tự ảnh phải là số nguyên' })
  @Min(0, { message: 'Thứ tự ảnh không được nhỏ hơn 0' })
  sortOrder?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Ảnh chính trong gallery ảnh phụ',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => optionalBoolean(value))
  @IsBoolean({ message: 'isPrimary phải là true hoặc false' })
  isPrimary?: boolean;
}
