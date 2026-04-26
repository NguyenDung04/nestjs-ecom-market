import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryCategoryDto {
  @ApiPropertyOptional({
    example: 'điện thoại',
    description: 'Từ khóa tìm kiếm theo tên hoặc mô tả danh mục',
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  keyword?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Lọc theo trạng thái hoạt động của danh mục',
  })
  @IsOptional()
  @IsString({ message: 'Trạng thái hoạt động phải là chuỗi ký tự' })
  isActive?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Số trang hiện tại',
  })
  @IsOptional()
  @IsString({ message: 'Số trang phải là chuỗi ký tự' })
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Số lượng bản ghi trên mỗi trang',
  })
  @IsOptional()
  @IsString({ message: 'Số lượng bản ghi phải là chuỗi ký tự' })
  limit?: string;

  @ApiPropertyOptional({
    example: 'id',
    description: 'Trường dữ liệu dùng để sắp xếp',
  })
  @IsOptional()
  @IsString({ message: 'Trường sắp xếp phải là chuỗi ký tự' })
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Thứ tự sắp xếp dữ liệu',
  })
  @IsOptional()
  @IsString({ message: 'Thứ tự sắp xếp phải là chuỗi ký tự' })
  sortOrder?: string;
}
