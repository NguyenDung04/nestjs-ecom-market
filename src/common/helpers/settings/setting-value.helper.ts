import { BadRequestException } from '@nestjs/common';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';

export function validateSettingValueByType(
  value: string | null | undefined,
  valueType: SettingValueType,
): void {
  if (value === null || value === undefined || value === '') {
    return;
  }

  switch (valueType) {
    case SettingValueType.STRING:
      return;

    case SettingValueType.NUMBER:
      validateNumberValue(value);
      return;

    case SettingValueType.BOOLEAN:
      validateBooleanValue(value);
      return;

    case SettingValueType.JSON:
      validateJsonValue(value);
      return;

    default:
      throw new BadRequestException('Kiểu giá trị cài đặt không hợp lệ');
  }
}

function validateNumberValue(value: string): void {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    throw new BadRequestException(
      'Giá trị cài đặt phải là số khi value_type là number',
    );
  }
}

function validateBooleanValue(value: string): void {
  const validValues = ['true', 'false'];

  if (!validValues.includes(value.toLowerCase())) {
    throw new BadRequestException(
      'Giá trị cài đặt phải là true hoặc false khi value_type là boolean',
    );
  }
}

function validateJsonValue(value: string): void {
  try {
    JSON.parse(value);
  } catch {
    throw new BadRequestException(
      'Giá trị cài đặt phải là JSON hợp lệ khi value_type là json',
    );
  }
}
