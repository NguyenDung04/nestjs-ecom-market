import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ContactStatus } from 'src/common/enums/ecommerce.enum';

export class CreateContactDto {
  @ApiProperty({
    example: 'Nguyễn Trí Dũng',
    description: 'Họ tên người liên hệ',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 'dung@example.com', description: 'Email liên hệ' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email!: string;

  @ApiPropertyOptional({
    example: '0378519357',
    description: 'Số điện thoại',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Cần hỗ trợ đơn hàng',
    description: 'Tiêu đề liên hệ',
    maxLength: 180,
  })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  subject?: string;

  @ApiProperty({
    example: 'Tôi cần hỗ trợ về đơn hàng.',
    description: 'Nội dung liên hệ',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiPropertyOptional({ enum: ContactStatus, example: ContactStatus.NEW })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
