import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/common/enums/ecommerce.enum';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 1, description: 'ID người dùng đặt hàng' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID mã giảm giá' })
  @IsOptional()
  @IsInt()
  couponId?: number;

  @ApiProperty({
    example: 'ORD-20260426-0001',
    description: 'Mã đơn hàng',
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  orderCode!: string;

  @ApiProperty({
    example: 'Nguyễn Trí Dũng',
    description: 'Tên khách hàng',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  customerName!: string;

  @ApiProperty({
    example: '0378519357',
    description: 'Số điện thoại khách hàng',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  customerPhone!: string;

  @ApiPropertyOptional({
    example: 'dung@example.com',
    description: 'Email khách hàng',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  customerEmail?: string;

  @ApiProperty({
    example: 'Số 1 Xuân Thủy, Cầu Giấy, Hà Nội',
    description: 'Địa chỉ giao hàng',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  shippingAddress!: string;

  @ApiPropertyOptional({
    example: 'Giao giờ hành chính',
    description: 'Ghi chú đơn hàng',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @ApiPropertyOptional({ example: '1000000.00', description: 'Tạm tính' })
  @IsOptional()
  @IsNumberString()
  subtotal?: string;

  @ApiPropertyOptional({ example: '30000.00', description: 'Phí vận chuyển' })
  @IsOptional()
  @IsNumberString()
  shippingFee?: string;

  @ApiPropertyOptional({ example: '50000.00', description: 'Số tiền giảm' })
  @IsOptional()
  @IsNumberString()
  discountAmount?: string;

  @ApiPropertyOptional({ example: '980000.00', description: 'Tổng thanh toán' })
  @IsOptional()
  @IsNumberString()
  totalAmount?: string;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.UNPAID })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.PENDING })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;
}
