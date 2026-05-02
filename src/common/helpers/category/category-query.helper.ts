import { QueryCategoryDto } from 'src/modules/categories/dto/query-category.dto';
import { Category } from 'src/modules/categories/entities/category.entity';
import { SelectQueryBuilder } from 'typeorm';

const ALLOWED_CATEGORY_SORT_FIELDS = [
  'id',
  'name',
  'slug',
  'createdAt',
  'updatedAt',
] as const;

type CategorySortField = (typeof ALLOWED_CATEGORY_SORT_FIELDS)[number];
type SortOrder = 'ASC' | 'DESC';

export function getCategorySortOptions(query: QueryCategoryDto): {
  sortBy: CategorySortField;
  sortOrder: SortOrder;
} {
  const sortBy: CategorySortField = ALLOWED_CATEGORY_SORT_FIELDS.includes(
    query.sortBy as CategorySortField,
  )
    ? (query.sortBy as CategorySortField)
    : 'createdAt';

  const sortOrder: SortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

  return {
    sortBy,
    sortOrder,
  };
}

export function applyCategoryFilters(
  qb: SelectQueryBuilder<Category>,
  query: QueryCategoryDto,
) {
  if (query.search) {
    qb.andWhere('(category.name LIKE :search OR category.slug LIKE :search)', {
      search: `%${query.search}%`,
    });
  }

  if (typeof query.isActive === 'boolean') {
    qb.andWhere('category.is_active = :isActive', {
      isActive: query.isActive,
    });
  }

  if (typeof query.parentId === 'number') {
    qb.andWhere('category.parent_id = :parentId', {
      parentId: query.parentId,
    });
  }

  return qb;
}
