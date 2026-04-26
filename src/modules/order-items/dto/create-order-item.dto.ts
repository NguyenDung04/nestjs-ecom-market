import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'ID đơn hàng' })
  @IsInt()
  orderId!: number;

  @ApiPropertyOptional({ example: 1, description: 'ID sản phẩm' })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({
    example: 'iPhone 15 Pro Max',
    description: 'Tên sản phẩm tại thời điểm đặt hàng',
    maxLength: 180,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(180)
  productName!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/product.png',
    description: 'Ảnh sản phẩm tại thời điểm đặt hàng',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  productImage?: string;

  @ApiProperty({ example: 2, description: 'Số lượng' })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: '29990000.00', description: 'Đơn giá' })
  @IsNumberString()
  price!: string;

  @ApiProperty({ example: '59980000.00', description: 'Thành tiền' })
  @IsNumberString()
  total!: string;
}
