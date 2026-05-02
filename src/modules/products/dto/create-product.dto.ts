/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';

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

function emptyToNull(value: unknown) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    value === 'null' ||
    value === 'undefined'
  ) {
    return null;
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

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID danh mục của sản phẩm',
  })
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'ID danh mục phải là số nguyên' })
  @Min(1, { message: 'ID danh mục phải lớn hơn 0' })
  categoryId!: number;

  @ApiProperty({
    example: 'iPhone 15 128GB',
    description: 'Tên sản phẩm',
    maxLength: 200,
  })
  @Transform(({ value }) => String(value || '').trim())
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
  name!: string;

  @ApiPropertyOptional({
    example: 'iphone-15-128gb',
    description:
      'Slug sản phẩm. Nếu không truyền, hệ thống sẽ tự tạo từ tên sản phẩm.',
    maxLength: 220,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString({ message: 'Slug sản phẩm phải là chuỗi ký tự' })
  @MaxLength(220, { message: 'Slug sản phẩm không được vượt quá 220 ký tự' })
  slug?: string;

  @ApiProperty({
    example: 'IP15-128',
    description: 'Mã SKU duy nhất của sản phẩm',
    maxLength: 80,
  })
  @Transform(({ value }) => String(value || '').trim())
  @IsNotEmpty({ message: 'Mã SKU không được để trống' })
  @IsString({ message: 'Mã SKU phải là chuỗi ký tự' })
  @MaxLength(80, { message: 'Mã SKU không được vượt quá 80 ký tự' })
  sku!: string;

  @ApiProperty({
    example: 21990000,
    description: 'Giá bán gốc của sản phẩm',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
  @Min(0, { message: 'Giá sản phẩm không được nhỏ hơn 0' })
  price!: number;

  @ApiPropertyOptional({
    example: 20990000,
    description: 'Giá khuyến mãi của sản phẩm',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const normalizedValue = emptyToNull(value);

    if (normalizedValue === null) {
      return null;
    }

    return Number(normalizedValue);
  })
  @IsNumber({}, { message: 'Giá khuyến mãi phải là số' })
  @Min(0, { message: 'Giá khuyến mãi không được nhỏ hơn 0' })
  salePrice?: number | null;

  @ApiProperty({
    example: 20,
    description: 'Số lượng tồn kho',
  })
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng không được nhỏ hơn 0' })
  quantity!: number;

  @ApiPropertyOptional({
    example: 'Điện thoại iPhone 15 bản 128GB',
    description: 'Mô tả ngắn của sản phẩm',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @IsString({ message: 'Mô tả ngắn phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả ngắn không được vượt quá 500 ký tự' })
  shortDescription?: string | null;

  @ApiPropertyOptional({
    example: 'Màn hình đẹp, hiệu năng mạnh, camera chất lượng cao.',
    description: 'Mô tả chi tiết sản phẩm',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @IsString({ message: 'Mô tả chi tiết phải là chuỗi ký tự' })
  description?: string | null;

  @ApiPropertyOptional({
    example: 'uploads/products/product-1710000000000.jpg',
    description:
      'Ảnh đại diện sản phẩm. Khi upload file, hệ thống sẽ tự ghi path này.',
    maxLength: 255,
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @IsString({ message: 'Ảnh đại diện phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh đại diện không được vượt quá 255 ký tự' })
  thumbnail?: string | null;

  @ApiPropertyOptional({
    example: ProductStatus.ACTIVE,
    description: 'Trạng thái sản phẩm',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsEnum(ProductStatus, {
    message: 'Trạng thái sản phẩm không hợp lệ',
  })
  status?: ProductStatus;
}
