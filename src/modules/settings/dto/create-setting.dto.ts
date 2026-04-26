import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';

export class CreateSettingDto {
  @ApiProperty({
    example: 'site_name',
    description: 'Khóa cấu hình',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  settingKey!: string;

  @ApiPropertyOptional({
    example: 'Ecommerce Basic Plus',
    description: 'Giá trị cấu hình',
  })
  @IsOptional()
  @IsString()
  settingValue?: string;

  @ApiPropertyOptional({
    enum: SettingValueType,
    example: SettingValueType.STRING,
  })
  @IsOptional()
  @IsEnum(SettingValueType)
  valueType?: SettingValueType;

  @ApiPropertyOptional({
    example: 'Tên website',
    description: 'Mô tả cấu hình',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
