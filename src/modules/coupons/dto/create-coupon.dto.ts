import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CouponType } from 'src/common/enums/ecommerce.enum';

export class CreateCouponDto {
  @ApiProperty({ example: 'SALE10', description: 'Mã giảm giá', maxLength: 50 })
  @IsNotEmpty({ message: 'Mã giảm giá không được để trống' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({
    enum: CouponType,
    example: CouponType.PERCENT,
    description: 'Loại mã giảm giá',
  })
  @IsEnum(CouponType, { message: 'Loại mã giảm giá không hợp lệ' })
  type!: CouponType;

  @ApiProperty({ example: '10.00', description: 'Giá trị giảm' })
  @IsNumberString({}, { message: 'Giá trị giảm phải là chuỗi số hợp lệ' })
  value!: string;

  @ApiPropertyOptional({
    example: '100000.00',
    description: 'Giá trị đơn hàng tối thiểu',
  })
  @IsOptional()
  @IsNumberString()
  minOrderAmount?: string;

  @ApiPropertyOptional({
    example: '50000.00',
    description: 'Số tiền giảm tối đa',
  })
  @IsOptional()
  @IsNumberString()
  maxDiscountAmount?: string;

  @ApiPropertyOptional({ example: 100, description: 'Giới hạn lượt dùng' })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Ngày bắt đầu',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Ngày kết thúc',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  endDate?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
