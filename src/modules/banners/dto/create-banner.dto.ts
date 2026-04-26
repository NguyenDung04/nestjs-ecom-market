import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({
    example: 'Khuyến mãi hè',
    description: 'Tiêu đề banner',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'https://example.com/banner.png',
    description: 'Đường dẫn ảnh banner',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  imageUrl!: string;

  @ApiPropertyOptional({
    example: '/products',
    description: 'Đường dẫn khi click banner',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkUrl?: string;

  @ApiPropertyOptional({
    example: 'home',
    description: 'Vị trí hiển thị',
    maxLength: 60,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  position?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự hiển thị',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
