import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import {
  buildPaginatedResponse,
  getPaginationParams,
} from 'src/common/utils/pagination.util';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

import { buildCategoryTree } from 'src/common/helpers/category/category-tree.helper';
import {
  normalizeCreateCategoryPayload,
  normalizeUpdateCategoryPayload,
} from 'src/common/helpers/category/category-normalizer.helper';
import { CategoryValidator } from 'src/common/validators/category.validator';
import {
  applyCategoryFilters,
  getCategorySortOptions,
} from 'src/common/helpers/category/category-query.helper';

/**
 * Service xử lý nghiệp vụ danh mục.
 *
 * Helper sử dụng:
 * - getPaginationParams: chuẩn hóa page, limit, skip cho phân trang.
 * - buildPaginatedResponse: format response danh sách có meta phân trang.
 * - getCategorySortOptions: chuẩn hóa sortBy, sortOrder từ query.
 * - applyCategoryFilters: áp dụng search, isActive, parentId vào QueryBuilder.
 * - buildCategoryTree: chuyển danh sách danh mục phẳng thành cây cha/con.
 * - normalizeCreateCategoryPayload: chuẩn hóa dữ liệu trước khi tạo danh mục.
 * - normalizeUpdateCategoryPayload: chuẩn hóa dữ liệu trước khi cập nhật danh mục.
 * - CategoryValidator: xử lý các validate nghiệp vụ của danh mục.
 */

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly categoryValidator: CategoryValidator,
  ) {}

  async findAll(query: QueryCategoryDto) {
    const { page, limit, skip } = getPaginationParams(query.page, query.limit);
    const { sortBy, sortOrder } = getCategorySortOptions(query);

    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .loadRelationCountAndMap('category.productCount', 'category.products')
      .loadRelationCountAndMap('category.childrenCount', 'category.children')
      .where('category.deleted_at IS NULL');

    applyCategoryFilters(qb, query);

    qb.orderBy(`category.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [items, totalItems] = await qb.getManyAndCount();

    return buildPaginatedResponse(items, totalItems, page, limit);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      relations: {
        parent: true,
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  async findTree() {
    const categories = await this.categoryRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: {
        name: 'ASC',
      },
    });

    return buildCategoryTree(categories);
  }

  async findActiveForProductForm() {
    return this.categoryRepository.find({
      where: {
        isActive: true,
        deletedAt: IsNull(),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const payload = normalizeCreateCategoryPayload(createCategoryDto);

    const imagePath = this.getCategoryImagePath(image);

    if (imagePath) {
      payload.image = imagePath;
    }

    await this.categoryValidator.validateParentExists(payload.parentId);
    await this.categoryValidator.validateSlugUnique(payload.slug);
    await this.categoryValidator.validateNameUniqueInSameParent(
      payload.name,
      payload.parentId,
    );

    const category = this.categoryRepository.create(payload);

    return this.categoryRepository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const category = await this.categoryValidator.findActiveCategoryOrFail(id);

    const payload = normalizeUpdateCategoryPayload(category, updateCategoryDto);

    const imagePath = this.getCategoryImagePath(image);

    if (imagePath) {
      payload.image = imagePath;
    }

    this.categoryValidator.validateParentNotSelf(id, payload.parentId);

    await this.categoryValidator.validateParentExists(payload.parentId);
    await this.categoryValidator.validateNoParentLoop(id, payload.parentId);
    await this.categoryValidator.validateSlugUnique(payload.slug, id);
    await this.categoryValidator.validateNameUniqueInSameParent(
      payload.name,
      payload.parentId,
      id,
    );

    Object.assign(category, payload);

    return this.categoryRepository.save(category);
  }

  async toggleActive(id: number) {
    const category = await this.categoryValidator.findActiveCategoryOrFail(id);

    category.isActive = !category.isActive;

    return this.categoryRepository.save(category);
  }

  async softDelete(id: number) {
    const category = await this.categoryValidator.findActiveCategoryOrFail(id);

    await this.categoryValidator.validateCategoryCanBeDeleted(category.id);

    await this.categoryRepository.softDelete(category.id);

    return {
      message: 'Xóa mềm danh mục thành công',
    };
  }

  async restore(id: number) {
    const category =
      await this.categoryValidator.findCategoryWithDeletedOrFail(id);

    this.categoryValidator.validateCategoryIsDeleted(category);

    await this.categoryRepository.restore(id);

    return {
      message: 'Khôi phục danh mục thành công',
    };
  }

  async forceDelete(id: number) {
    const category =
      await this.categoryValidator.findCategoryWithDeletedOrFail(id);

    await this.categoryValidator.validateCategoryCanBeDeleted(category.id, {
      force: true,
    });

    await this.categoryRepository.delete(id);

    return {
      message: 'Xóa vĩnh viễn danh mục thành công',
    };
  }

  private getCategoryImagePath(image?: Express.Multer.File) {
    if (!image) {
      return undefined;
    }

    return `uploads/categories/${image.filename}`;
  }
}
