/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';
import { Setting } from 'src/modules/settings/entities/setting.entity';
import { validateSettingValueByType } from '../helpers/settings/setting-value.helper';

@Injectable()
export class SettingValidator {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async validateSettingExists(id: number): Promise<Setting> {
    const setting = await this.settingRepository.findOne({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException('Không tìm thấy cài đặt');
    }

    return setting;
  }

  async validateSettingExistsWithDeleted(id: number): Promise<Setting> {
    const setting = await this.settingRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!setting) {
      throw new NotFoundException('Không tìm thấy cài đặt');
    }

    return setting;
  }

  async validateSettingKeyUnique(
    settingKey: string,
    ignoreId?: number,
  ): Promise<void> {
    const normalizedKey = settingKey.trim();

    if (!normalizedKey) {
      throw new BadRequestException('Khóa cài đặt không được để trống');
    }

    const where = ignoreId
      ? { settingKey: normalizedKey, id: Not(ignoreId) }
      : { settingKey: normalizedKey };

    const existedSetting = await this.settingRepository.findOne({
      where,
      withDeleted: true,
    });

    if (existedSetting) {
      throw new BadRequestException('Khóa cài đặt đã tồn tại');
    }
  }

  validateSettingValue(
    settingValue: string | null | undefined,
    valueType: SettingValueType,
  ): void {
    validateSettingValueByType(settingValue, valueType);
  }
}
