import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { InventoryLogType } from 'src/common/enums/ecommerce.enum';

export class CreateInventoryLogDto {
  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @IsInt()
  productId!: number;

  @ApiPropertyOptional({ example: 1, description: 'ID người thực hiện' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({
    enum: InventoryLogType,
    example: InventoryLogType.IMPORT,
    description: 'Loại giao dịch kho',
  })
  @IsNotEmpty()
  @IsEnum(InventoryLogType)
  type!: InventoryLogType;

  @ApiProperty({ example: 10, description: 'Số lượng thay đổi' })
  @IsInt()
  quantity!: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Số lượng trước khi thay đổi',
  })
  @IsOptional()
  @IsInt()
  quantityBefore?: number;

  @ApiPropertyOptional({
    example: 30,
    description: 'Số lượng sau khi thay đổi',
  })
  @IsOptional()
  @IsInt()
  quantityAfter?: number;

  @ApiPropertyOptional({
    example: 'Nhập hàng đầu kỳ',
    description: 'Ghi chú',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}
