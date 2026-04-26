import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 15',
    description: 'Tên sản phẩm',
    maxLength: 180,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  @MaxLength(180, { message: 'Tên sản phẩm không được vượt quá 180 ký tự' })
  name!: string;

  @ApiProperty({
    example: 'iphone-15',
    description: 'Đường dẫn định danh duy nhất của sản phẩm',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Đường dẫn sản phẩm không được để trống' })
  @IsString({ message: 'Đường dẫn sản phẩm phải là chuỗi ký tự' })
  @MaxLength(200, {
    message: 'Đường dẫn sản phẩm không được vượt quá 200 ký tự',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'Điện thoại Apple iPhone 15 chính hãng',
    description: 'Mô tả ngắn về sản phẩm',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả sản phẩm phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Mô tả sản phẩm không được vượt quá 255 ký tự' })
  description?: string;

  @ApiPropertyOptional({
    example: 'iphone15.jpg',
    description: 'Tên tệp ảnh hoặc đường dẫn ảnh của sản phẩm',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Ảnh sản phẩm phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ảnh sản phẩm không được vượt quá 255 ký tự' })
  image?: string;

  @ApiProperty({
    example: '22990000',
    description: 'Giá sản phẩm dạng chuỗi số thập phân',
  })
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  @IsNumberString({}, { message: 'Giá sản phẩm phải là chuỗi số hợp lệ' })
  price!: string;

  @ApiProperty({
    example: 50,
    description: 'Số lượng sản phẩm còn trong kho',
    minimum: 0,
  })
  @IsInt({ message: 'Số lượng tồn kho phải là số nguyên' })
  @Min(0, { message: 'Số lượng tồn kho không được nhỏ hơn 0' })
  stockQuantity!: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của sản phẩm',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là đúng hoặc sai' })
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Mã danh mục đã tồn tại trong hệ thống',
  })
  @IsInt({ message: 'Mã danh mục phải là số nguyên' })
  categoryId!: number;
}
