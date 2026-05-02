import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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

export class QueryProductDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'iphone',
    description: 'Tìm kiếm theo tên, slug hoặc SKU',
  })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Lọc theo ID danh mục',
  })
  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsInt({ message: 'ID danh mục phải là số nguyên' })
  @Min(1, { message: 'ID danh mục phải lớn hơn 0' })
  categoryId?: number;

  @ApiPropertyOptional({
    example: ProductStatus.ACTIVE,
    description: 'Lọc theo trạng thái sản phẩm',
    enum: ProductStatus,
  })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsEnum(ProductStatus, {
    message: 'Trạng thái sản phẩm không hợp lệ',
  })
  status?: ProductStatus;

  @ApiPropertyOptional({
    example: 100000,
    description: 'Giá thấp nhất',
  })
  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsNumber({}, { message: 'Giá thấp nhất phải là số' })
  @Min(0, { message: 'Giá thấp nhất không được nhỏ hơn 0' })
  minPrice?: number;

  @ApiPropertyOptional({
    example: 30000000,
    description: 'Giá cao nhất',
  })
  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsNumber({}, { message: 'Giá cao nhất phải là số' })
  @Min(0, { message: 'Giá cao nhất không được nhỏ hơn 0' })
  maxPrice?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Lọc sản phẩm đang có giá khuyến mãi',
  })
  @IsOptional()
  @Transform(({ value }) => optionalBoolean(value))
  @IsBoolean({ message: 'hasSale phải là true hoặc false' })
  hasSale?: boolean;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Trường sắp xếp',
    enum: [
      'id',
      'name',
      'slug',
      'sku',
      'price',
      'salePrice',
      'quantity',
      'status',
      'createdAt',
      'updatedAt',
    ],
    default: 'createdAt',
  })
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsIn(
    [
      'id',
      'name',
      'slug',
      'sku',
      'price',
      'salePrice',
      'quantity',
      'status',
      'createdAt',
      'updatedAt',
    ],
    { message: 'Trường sắp xếp không hợp lệ' },
  )
  sortBy?: string = 'createdAt';
}
