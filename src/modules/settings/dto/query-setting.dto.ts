import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';

export class QuerySettingDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(SettingValueType, {
    message: 'valueType chỉ được là string, number, boolean hoặc json',
  })
  valueType?: SettingValueType;

  @IsOptional()
  @IsIn(['settingKey', 'valueType', 'createdAt', 'updatedAt'])
  sortBy?: 'settingKey' | 'valueType' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page phải lớn hơn hoặc bằng 1' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit phải lớn hơn hoặc bằng 1' })
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  withDeleted?: boolean;
}
