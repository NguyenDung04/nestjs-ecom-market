import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';

export class CreateSettingDto {
  @IsNotEmpty({ message: 'Khóa cài đặt không được để trống' })
  @IsString({ message: 'Khóa cài đặt phải là chuỗi' })
  @MaxLength(100, { message: 'Khóa cài đặt không được vượt quá 100 ký tự' })
  settingKey!: string;

  @IsOptional()
  @IsString({ message: 'Giá trị cài đặt phải là chuỗi' })
  settingValue?: string | null;

  @IsOptional()
  @IsEnum(SettingValueType, {
    message: 'Kiểu giá trị chỉ được là string, number, boolean hoặc json',
  })
  valueType?: SettingValueType;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  @MaxLength(255, { message: 'Mô tả không được vượt quá 255 ký tự' })
  description?: string | null;
}
