import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class CategoryValidator {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findActiveCategoryOrFail(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  async findCategoryWithDeletedOrFail(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  async validateParentExists(parentId?: number | null) {
    if (!parentId) {
      return;
    }

    const parent = await this.categoryRepository.findOne({
      where: {
        id: parentId,
        deletedAt: IsNull(),
      },
    });

    if (!parent) {
      throw new BadRequestException('Danh mục cha không tồn tại');
    }
  }

  validateParentNotSelf(categoryId: number, parentId: number | null) {
    if (parentId === categoryId) {
      throw new BadRequestException(
        'Danh mục cha không được trùng với chính danh mục hiện tại',
      );
    }
  }

  async validateSlugUnique(slug: string, ignoreId?: number) {
    const where = ignoreId
      ? {
          slug,
          id: Not(ignoreId),
          deletedAt: IsNull(),
        }
      : {
          slug,
          deletedAt: IsNull(),
        };

    const existed = await this.categoryRepository.findOne({ where });

    if (existed) {
      throw new ConflictException('Danh mục đã tồn tại');
    }
  }

  async validateNameUniqueInSameParent(
    name: string,
    parentId: number | null,
    ignoreId?: number,
  ) {
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name })
      .andWhere('category.deleted_at IS NULL');

    if (parentId) {
      qb.andWhere('category.parent_id = :parentId', { parentId });
    } else {
      qb.andWhere('category.parent_id IS NULL');
    }

    if (ignoreId) {
      qb.andWhere('category.id != :ignoreId', { ignoreId });
    }

    const existed = await qb.getOne();

    if (existed) {
      throw new ConflictException(
        'Tên danh mục đã tồn tại trong cùng danh mục cha',
      );
    }
  }

  async validateNoParentLoop(
    currentCategoryId: number,
    newParentId: number | null,
  ) {
    if (!newParentId) {
      return;
    }

    let parent = await this.categoryRepository.findOne({
      where: {
        id: newParentId,
        deletedAt: IsNull(),
      },
    });

    while (parent) {
      if (parent.id === currentCategoryId) {
        throw new BadRequestException(
          'Không thể chọn danh mục con làm danh mục cha vì sẽ tạo vòng lặp',
        );
      }

      if (!parent.parentId) {
        break;
      }

      parent = await this.categoryRepository.findOne({
        where: {
          id: parent.parentId,
          deletedAt: IsNull(),
        },
      });
    }
  }

  async validateCategoryCanBeDeleted(
    categoryId: number,
    options?: {
      force?: boolean;
    },
  ) {
    const force = options?.force ?? false;

    const productCount = await this.productRepository.count({
      where: {
        categoryId,
      },
      withDeleted: force,
    });

    if (productCount > 0) {
      throw new BadRequestException(
        force
          ? 'Không thể xóa vĩnh viễn danh mục đang có sản phẩm'
          : 'Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển trạng thái ẩn thay vì xóa.',
      );
    }

    const childrenCount = await this.categoryRepository.count({
      where: force
        ? {
            parentId: categoryId,
          }
        : {
            parentId: categoryId,
            deletedAt: IsNull(),
          },
      withDeleted: force,
    });

    if (childrenCount > 0) {
      throw new BadRequestException(
        force
          ? 'Không thể xóa vĩnh viễn danh mục đang có danh mục con'
          : 'Không thể xóa danh mục đang có danh mục con',
      );
    }
  }

  validateCategoryIsDeleted(category: Category) {
    if (!category.deletedAt) {
      throw new BadRequestException('Danh mục này chưa bị xóa mềm');
    }
  }
}
