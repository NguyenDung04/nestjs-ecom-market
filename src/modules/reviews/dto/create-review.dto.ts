import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID người đánh giá' })
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @IsInt()
  productId!: number;

  @ApiPropertyOptional({ example: 1, description: 'ID đơn hàng' })
  @IsOptional()
  @IsInt()
  orderId?: number;

  @ApiProperty({ example: 5, description: 'Số sao đánh giá từ 1 đến 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({
    example: 'Sản phẩm tốt, giao nhanh',
    description: 'Nội dung đánh giá',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hiển thị đánh giá',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
