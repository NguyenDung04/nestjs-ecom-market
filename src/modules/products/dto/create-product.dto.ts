import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';

export class CreateProductDto {
  @ApiPropertyOptional({ example: 1, description: 'ID danh mục' })
  @IsOptional()
  @IsInt({ message: 'ID danh mục phải là số nguyên' })
  categoryId?: number;

  @ApiProperty({
    example: 'iPhone 15 Pro Max',
    description: 'Tên sản phẩm',
    maxLength: 180,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @MaxLength(180, { message: 'Tên sản phẩm không được vượt quá 180 ký tự' })
  name!: string;

  @ApiProperty({
    example: 'iphone-15-pro-max',
    description: 'Slug sản phẩm',
    maxLength: 220,
  })
  @IsNotEmpty({ message: 'Slug sản phẩm không được để trống' })
  @IsString({ message: 'Slug sản phẩm phải là chuỗi ký tự' })
  @MaxLength(220, { message: 'Slug sản phẩm không được vượt quá 220 ký tự' })
  slug!: string;

  @ApiProperty({
    example: 'IP15PM-256',
    description: 'Mã SKU sản phẩm',
    maxLength: 80,
  })
  @IsNotEmpty({ message: 'SKU không được để trống' })
  @IsString({ message: 'SKU phải là chuỗi ký tự' })
  @MaxLength(80, { message: 'SKU không được vượt quá 80 ký tự' })
  sku!: string;

  @ApiProperty({ example: '29990000.00', description: 'Giá bán sản phẩm' })
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  @IsNumberString({}, { message: 'Giá sản phẩm phải là chuỗi số hợp lệ' })
  price!: string;

  @ApiPropertyOptional({
    example: '27990000.00',
    description: 'Giá khuyến mãi',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Giá khuyến mãi phải là chuỗi số hợp lệ' })
  salePrice?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Số lượng tồn kho',
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng không được âm' })
  quantity?: number;

  @ApiPropertyOptional({
    example: 'Sản phẩm chính hãng',
    description: 'Mô tả ngắn',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả ngắn phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Mô tả ngắn không được vượt quá 255 ký tự' })
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 'Mô tả chi tiết sản phẩm',
    description: 'Mô tả chi tiết',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả chi tiết phải là chuỗi ký tự' })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/product.png',
    description: 'Ảnh đại diện sản phẩm',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Ảnh đại diện phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh đại diện không được vượt quá 255 ký tự' })
  thumbnail?: string;

  @ApiPropertyOptional({
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    description: 'Trạng thái sản phẩm',
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Trạng thái sản phẩm không hợp lệ' })
  status?: ProductStatus;
}
