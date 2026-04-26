import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ example: 1, description: 'ID giỏ hàng' })
  @IsInt({ message: 'ID giỏ hàng phải là số nguyên' })
  cartId!: number;

  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @IsInt({ message: 'ID sản phẩm phải là số nguyên' })
  productId!: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Số lượng sản phẩm',
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity?: number;

  @ApiPropertyOptional({
    example: '199000.00',
    description: 'Giá tại thời điểm thêm vào giỏ',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Giá phải là chuỗi số hợp lệ' })
  price?: string;
}
