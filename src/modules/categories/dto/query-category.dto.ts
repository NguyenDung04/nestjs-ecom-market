// src/modules/categories/dto/query-category.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class QueryCategoryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'dien thoai',
    description: 'Từ khóa tìm kiếm theo tên hoặc slug',
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Lọc theo trạng thái hoạt động',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === '1' || value === 1) {
      return true;
    }

    if (value === false || value === 'false' || value === '0' || value === 0) {
      return false;
    }

    return undefined;
  })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là đúng hoặc sai' })
  isActive?: boolean;

  @ApiPropertyOptional({
    example: null,
    description: 'ID danh mục cha nếu có. Nếu null thì là danh mục cấp 1.',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      value === 'null' ||
      value === 'undefined'
    ) {
      return null;
    }

    return Number(value);
  })
  @IsInt({ message: 'ID danh mục cha phải là số nguyên' })
  @Min(1, { message: 'ID danh mục cha phải lớn hơn 0' })
  parentId?: number | null;
}
