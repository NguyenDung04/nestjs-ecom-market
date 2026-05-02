import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class SortProductImageItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID ảnh sản phẩm',
  })
  @Type(() => Number)
  @IsInt({ message: 'ID ảnh phải là số nguyên' })
  @Min(1, { message: 'ID ảnh phải lớn hơn 0' })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'Thứ tự hiển thị mới',
  })
  @Type(() => Number)
  @IsInt({ message: 'Thứ tự ảnh phải là số nguyên' })
  @Min(0, { message: 'Thứ tự ảnh không được nhỏ hơn 0' })
  sortOrder!: number;
}

export class SortProductImagesDto {
  @ApiProperty({
    description: 'Danh sách ảnh cần cập nhật thứ tự',
    type: [SortProductImageItemDto],
    example: [
      {
        id: 1,
        sortOrder: 1,
      },
      {
        id: 2,
        sortOrder: 2,
      },
    ],
  })
  @IsArray({ message: 'Danh sách sắp xếp phải là mảng' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 ảnh để sắp xếp' })
  @ValidateNested({ each: true })
  @Type(() => SortProductImageItemDto)
  items!: SortProductImageItemDto[];
}
