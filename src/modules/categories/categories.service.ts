import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
  sanitizeBoolean,
  sanitizeKeyword,
  sanitizePositiveInt,
  sanitizeSortField,
  sanitizeSortOrder,
} from '../../common/utils/query.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: QueryCategoryDto) {
    const keyword = sanitizeKeyword(query.keyword);
    const isActive = sanitizeBoolean(query.isActive);
    const page = sanitizePositiveInt(query.page, 1, 1, 100000);
    const limit = sanitizePositiveInt(query.limit, 10, 1, 100);
    const sortBy = sanitizeSortField(
      query.sortBy,
      ['id', 'name', 'slug', 'createdAt'] as const,
      'id',
    );
    const sortOrder = sanitizeSortOrder(query.sortOrder);

    const qb = this.categoryRepository.createQueryBuilder('category');

    if (keyword) {
      qb.andWhere(
        '(category.name LIKE :keyword OR category.slug LIKE :keyword OR category.description LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    if (typeof isActive === 'boolean') {
      qb.andWhere('category.isActive = :isActive', { isActive });
    }

    const sortFieldMap = {
      id: 'category.id',
      name: 'category.name',
      slug: 'category.slug',
      createdAt: 'category.createdAt',
    } as const;

    qb.orderBy(sortFieldMap[sortBy], sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { name },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { slug },
    });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existingName = await this.findByName(dto.name);
    if (existingName) {
      throw new ConflictException('Tên danh mục đã tồn tại');
    }

    const existingSlug = await this.findBySlug(dto.slug);
    if (existingSlug) {
      throw new ConflictException('Đường dẫn danh mục đã tồn tại');
    }

    const category = this.categoryRepository.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name && dto.name !== category.name) {
      const existingName = await this.findByName(dto.name);
      if (existingName) {
        throw new ConflictException('Tên danh mục đã tồn tại');
      }
      category.name = dto.name;
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existingSlug = await this.findBySlug(dto.slug);
      if (existingSlug) {
        throw new ConflictException('Đường dẫn danh mục đã tồn tại');
      }
      category.slug = dto.slug;
    }

    if (dto.description !== undefined) {
      category.description = dto.description;
    }

    if (typeof dto.isActive === 'boolean') {
      category.isActive = dto.isActive;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.softRemove(category);
  }

  async restore(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (!category.deletedAt) {
      return category;
    }

    await this.categoryRepository.restore(id);

    return this.findOne(id);
  }
}
