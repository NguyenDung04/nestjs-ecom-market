// src/common/dto/pagination-query.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Trang hiện tại',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang hiện tại phải là số nguyên' })
  @Min(1, { message: 'Trang hiện tại phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Số bản ghi trên mỗi trang',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số bản ghi trên mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số bản ghi trên mỗi trang phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'Số bản ghi trên mỗi trang không được vượt quá 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Trường dùng để sắp xếp',
    default: 'createdAt',
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Kiểu sắp xếp',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], {
    message: 'Kiểu sắp xếp chỉ nhận ASC hoặc DESC',
  })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
