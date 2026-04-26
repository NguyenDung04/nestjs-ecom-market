import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { NotificationType } from 'src/common/enums/ecommerce.enum';

export class CreateNotificationDto {
  @ApiPropertyOptional({ example: 1, description: 'ID người nhận thông báo' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({
    example: 'Đơn hàng đã được xác nhận',
    description: 'Tiêu đề thông báo',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'Đơn hàng ORD-001 của bạn đã được xác nhận.',
    description: 'Nội dung thông báo',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    enum: NotificationType,
    example: NotificationType.ORDER,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    example: false,
    description: 'Trạng thái đã đọc',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
