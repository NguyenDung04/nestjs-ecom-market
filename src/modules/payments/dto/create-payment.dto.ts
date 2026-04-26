import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from 'src/common/enums/ecommerce.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'ID đơn hàng' })
  @IsInt()
  orderId!: number;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    example: 'TXN123456',
    description: 'Mã giao dịch',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionCode?: string;

  @ApiProperty({ example: '980000.00', description: 'Số tiền thanh toán' })
  @IsNumberString()
  amount!: string;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.UNPAID })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    example: '2026-04-26T10:00:00.000Z',
    description: 'Thời gian thanh toán',
  })
  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
