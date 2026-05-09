import { SettingValueType } from 'src/common/enums/ecommerce.enum';
import { CreateSettingDto } from 'src/modules/settings/dto/create-setting.dto';
import { UpdateSettingDto } from 'src/modules/settings/dto/update-setting.dto';

export function normalizeCreateSettingPayload(dto: CreateSettingDto) {
  return {
    settingKey: dto.settingKey.trim(),
    settingValue: dto.settingValue?.trim() || null,
    valueType: dto.valueType || SettingValueType.STRING,
    description: dto.description?.trim() || null,
  };
}

export function normalizeUpdateSettingPayload(dto: UpdateSettingDto) {
  const payload: Partial<{
    settingKey: string;
    settingValue: string | null;
    valueType: SettingValueType;
    description: string | null;
  }> = {};

  if (dto.settingKey !== undefined) {
    payload.settingKey = dto.settingKey.trim();
  }

  if (dto.settingValue !== undefined) {
    payload.settingValue = dto.settingValue?.trim() || null;
  }

  if (dto.valueType !== undefined) {
    payload.valueType = dto.valueType;
  }

  if (dto.description !== undefined) {
    payload.description = dto.description?.trim() || null;
  }

  return payload;
}
