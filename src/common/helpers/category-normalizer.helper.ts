import { toSlug } from 'src/common/utils/slug.util';
import { CreateCategoryDto } from 'src/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
import { Category } from 'src/modules/categories/entities/category.entity';

export function normalizeCreateCategoryPayload(dto: CreateCategoryDto) {
  const name = dto.name.trim();

  const slug = dto.slug?.trim() ? toSlug(dto.slug) : toSlug(name);

  return {
    name,
    slug,
    description: dto.description?.trim() || null,
    image: dto.image?.trim() || null,
    parentId: dto.parentId ?? null,
    isActive: dto.isActive ?? true,
  };
}

export function normalizeUpdateCategoryPayload(
  category: Category,
  dto: UpdateCategoryDto,
) {
  const name = dto.name?.trim() || category.name;

  const slug = dto.slug?.trim()
    ? toSlug(dto.slug)
    : dto.name
      ? toSlug(dto.name)
      : category.slug;

  const parentId =
    dto.parentId === undefined ? category.parentId : dto.parentId;

  return {
    name,
    slug,
    parentId: parentId ?? null,
    description:
      dto.description === undefined
        ? category.description
        : dto.description?.trim() || null,
    image: dto.image === undefined ? category.image : dto.image?.trim() || null,
    isActive: dto.isActive === undefined ? category.isActive : dto.isActive,
  };
}
