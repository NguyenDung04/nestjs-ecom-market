import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { QuerySettingDto } from './dto/query-setting.dto';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';
import { SettingValidator } from 'src/common/validators/setting.validator';
import {
  applySettingFilter,
  applySettingPagination,
  applySettingSearch,
  applySettingSort,
  getSettingPaginationMeta,
} from 'src/common/helpers/settings/setting-query.helper';
import {
  normalizeCreateSettingPayload,
  normalizeUpdateSettingPayload,
} from 'src/common/helpers/settings/setting-payload.helper';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly settingValidator: SettingValidator,
  ) {}

  async findAll(query: QuerySettingDto) {
    const queryBuilder = this.settingRepository.createQueryBuilder('setting');

    if (query.withDeleted) {
      queryBuilder.withDeleted();
    }

    applySettingSearch(queryBuilder, query.keyword);
    applySettingFilter(queryBuilder, query);
    applySettingSort(queryBuilder, query);
    applySettingPagination(queryBuilder, query);

    const [settings, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: 'Lấy danh sách cài đặt thành công',
      data: settings,
      meta: getSettingPaginationMeta(total, query),
    };
  }

  async findOne(id: number) {
    const setting = await this.settingValidator.validateSettingExists(id);

    return {
      success: true,
      message: 'Lấy chi tiết cài đặt thành công',
      data: setting,
    };
  }

  async create(createSettingDto: CreateSettingDto) {
    const payload = normalizeCreateSettingPayload(createSettingDto);

    await this.settingValidator.validateSettingKeyUnique(payload.settingKey);
    this.settingValidator.validateSettingValue(
      payload.settingValue,
      payload.valueType,
    );

    const setting = this.settingRepository.create(payload);
    const savedSetting = await this.settingRepository.save(setting);

    return {
      success: true,
      message: 'Tạo cài đặt thành công',
      data: savedSetting,
    };
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    const setting = await this.settingValidator.validateSettingExists(id);
    const payload = normalizeUpdateSettingPayload(updateSettingDto);

    if (payload.settingKey !== undefined) {
      await this.settingValidator.validateSettingKeyUnique(
        payload.settingKey,
        id,
      );
    }

    const nextValueType = payload.valueType || setting.valueType;
    const nextSettingValue =
      payload.settingValue !== undefined
        ? payload.settingValue
        : setting.settingValue;

    this.settingValidator.validateSettingValue(nextSettingValue, nextValueType);

    Object.assign(setting, payload);

    const updatedSetting = await this.settingRepository.save(setting);

    return {
      success: true,
      message: 'Cập nhật cài đặt thành công',
      data: updatedSetting,
    };
  }

  async remove(id: number) {
    const setting = await this.settingValidator.validateSettingExists(id);

    await this.settingRepository.softRemove(setting);

    return {
      success: true,
      message: 'Xóa mềm cài đặt thành công',
      data: null,
    };
  }

  async restore(id: number) {
    const setting =
      await this.settingValidator.validateSettingExistsWithDeleted(id);

    if (!setting.deletedAt) {
      throw new BadRequestException('Cài đặt này chưa bị xóa');
    }

    const existedActiveSetting = await this.settingRepository.findOne({
      where: {
        id: Not(id),
        settingKey: setting.settingKey,
        deletedAt: IsNull(),
      },
    });

    if (existedActiveSetting) {
      throw new BadRequestException(
        'Không thể khôi phục vì khóa cài đặt đã tồn tại',
      );
    }

    await this.settingRepository.restore(id);

    const restoredSetting = await this.settingRepository.findOne({
      where: { id },
    });

    return {
      success: true,
      message: 'Khôi phục cài đặt thành công',
      data: restoredSetting,
    };
  }

  async forceDelete(id: number) {
    const setting =
      await this.settingValidator.validateSettingExistsWithDeleted(id);

    await this.settingRepository.remove(setting);

    return {
      success: true,
      message: 'Xóa vĩnh viễn cài đặt thành công',
      data: null,
    };
  }

  async findPublicSettings() {
    const publicKeys = [
      'site_name',
      'site_logo',
      'support_email',
      'support_phone',
      'default_shipping_fee',
      'free_shipping_min_order',
      'allow_cod',
      'allow_online_payment',
      'bank_account_name',
      'bank_account_number',
      'bank_name',
      'facebook_url',
      'maintenance_mode',
      'seo_keywords',
      'homepage_sections',
    ];

    const settings = await this.settingRepository
      .createQueryBuilder('setting')
      .where('setting.settingKey IN (:...publicKeys)', { publicKeys })
      .orderBy('setting.settingKey', 'ASC')
      .getMany();

    const data = settings.reduce<Record<string, unknown>>((result, setting) => {
      result[setting.settingKey] = this.parseSettingValue(
        setting.settingValue,
        setting.valueType,
      );

      return result;
    }, {});

    return {
      success: true,
      message: 'Lấy cấu hình website thành công',
      data,
    };
  }

  private parseSettingValue(
    value: string | null,
    valueType: SettingValueType,
  ): unknown {
    if (value === null) {
      return null;
    }

    switch (valueType) {
      case SettingValueType.NUMBER:
        return Number(value);

      case SettingValueType.BOOLEAN:
        return value.toLowerCase() === 'true';

      case SettingValueType.JSON:
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }

      case SettingValueType.STRING:
      default:
        return value;
    }
  }
}
