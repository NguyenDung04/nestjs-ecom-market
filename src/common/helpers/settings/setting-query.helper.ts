import { QuerySettingDto } from 'src/modules/settings/dto/query-setting.dto';
import { Setting } from 'src/modules/settings/entities/setting.entity';
import { SelectQueryBuilder } from 'typeorm';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function applySettingSearch(
  queryBuilder: SelectQueryBuilder<Setting>,
  keyword?: string,
): SelectQueryBuilder<Setting> {
  if (!keyword?.trim()) {
    return queryBuilder;
  }

  const searchKeyword = `%${keyword.trim()}%`;

  return queryBuilder.andWhere(
    `(setting.settingKey LIKE :keyword OR setting.description LIKE :keyword)`,
    { keyword: searchKeyword },
  );
}

export function applySettingFilter(
  queryBuilder: SelectQueryBuilder<Setting>,
  query: QuerySettingDto,
): SelectQueryBuilder<Setting> {
  if (query.valueType) {
    queryBuilder.andWhere('setting.valueType = :valueType', {
      valueType: query.valueType,
    });
  }

  return queryBuilder;
}

export function applySettingSort(
  queryBuilder: SelectQueryBuilder<Setting>,
  query: QuerySettingDto,
): SelectQueryBuilder<Setting> {
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const sortMap: Record<string, string> = {
    settingKey: 'setting.settingKey',
    valueType: 'setting.valueType',
    createdAt: 'setting.createdAt',
    updatedAt: 'setting.updatedAt',
  };

  queryBuilder.orderBy(sortMap[sortBy] || 'setting.createdAt', sortOrder);

  return queryBuilder;
}

export function applySettingPagination(
  queryBuilder: SelectQueryBuilder<Setting>,
  query: QuerySettingDto,
): SelectQueryBuilder<Setting> {
  const page = getPage(query.page);
  const limit = getLimit(query.limit);
  const skip = (page - 1) * limit;

  return queryBuilder.skip(skip).take(limit);
}

export function getSettingPaginationMeta(
  total: number,
  query: QuerySettingDto,
) {
  const page = getPage(query.page);
  const limit = getLimit(query.limit);
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
  };
}

function getPage(page?: number): number {
  if (!page || page < 1) {
    return DEFAULT_PAGE;
  }

  return page;
}

function getLimit(limit?: number): number {
  if (!limit || limit < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(limit, MAX_LIMIT);
}
