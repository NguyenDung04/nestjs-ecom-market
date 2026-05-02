import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateProductImageDto } from './create-product-image.dto';

export class BulkCreateProductImageDto {
  @ApiProperty({
    description: 'Danh sách ảnh phụ cần thêm',
    type: [CreateProductImageDto],
    example: [
      {
        imageUrl: 'products/iphone-15-1.jpg',
        sortOrder: 1,
        isPrimary: true,
      },
      {
        imageUrl: 'products/iphone-15-2.jpg',
        sortOrder: 2,
        isPrimary: false,
      },
    ],
  })
  @IsArray({ message: 'Danh sách ảnh phải là mảng' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 ảnh sản phẩm' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images!: CreateProductImageDto[];
}
