import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Express } from 'express';

import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  sanitizeBoolean,
  sanitizeKeyword,
  sanitizeOptionalInt,
  sanitizePositiveInt,
  sanitizeSortField,
  sanitizeSortOrder,
} from '../../common/utils/query.util';
import { toSlug } from '../../common/utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: QueryProductDto) {
    const keyword = sanitizeKeyword(query.keyword);
    const isActive = sanitizeBoolean(query.isActive);
    const categoryId = sanitizeOptionalInt(query.categoryId);
    const page = sanitizePositiveInt(query.page, 1, 1, 100000);
    const limit = sanitizePositiveInt(query.limit, 10, 1, 100);
    const sortBy = sanitizeSortField(
      query.sortBy,
      ['id', 'name', 'price', 'stockQuantity', 'createdAt'] as const,
      'id',
    );
    const sortOrder = sanitizeSortOrder(query.sortOrder);

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (keyword) {
      qb.andWhere(
        '(product.name LIKE :keyword OR product.slug LIKE :keyword OR product.description LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    if (typeof isActive === 'boolean') {
      qb.andWhere('product.isActive = :isActive', { isActive });
    }

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    const sortFieldMap = {
      id: 'product.id',
      name: 'product.name',
      price: 'product.price',
      stockQuantity: 'product.stockQuantity',
      createdAt: 'product.createdAt',
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

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.findById(id);

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { slug },
      withDeleted: true,
    });
  }

  async ensureCategoryExists(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  async create(
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const normalizedSlug = toSlug(dto.slug || dto.name);

    const existingSlug = await this.findBySlug(normalizedSlug);
    if (existingSlug) {
      throw new ConflictException('Đường dẫn sản phẩm đã tồn tại');
    }

    await this.ensureCategoryExists(dto.categoryId);

    const imagePath = file
      ? `/public/uploads/products/${file.filename}`
      : (dto.image ?? null);

    const product = this.productRepository.create({
      name: dto.name.trim(),
      slug: normalizedSlug,
      description: dto.description?.trim() ?? null,
      image: imagePath,
      price: dto.price,
      stockQuantity: dto.stockQuantity,
      isActive: dto.isActive ?? true,
      categoryId: dto.categoryId,
    });

    const saved = await this.productRepository.save(product);

    return this.findOne(saved.id);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.slug || dto.name) {
      const nextSlug = toSlug(dto.slug || dto.name || product.name);

      if (nextSlug !== product.slug) {
        const existingSlug = await this.findBySlug(nextSlug);
        if (existingSlug && existingSlug.id !== product.id) {
          throw new ConflictException('Đường dẫn sản phẩm đã tồn tại');
        }
        product.slug = nextSlug;
      }
    }

    if (dto.categoryId !== undefined) {
      await this.ensureCategoryExists(dto.categoryId);
      product.categoryId = dto.categoryId;
    }

    if (dto.name !== undefined) {
      product.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      product.description = dto.description?.trim() ?? null;
    }

    if (file) {
      product.image = `/public/uploads/products/${file.filename}`;
    } else if (dto.image !== undefined) {
      product.image = dto.image;
    }

    if (dto.price !== undefined) {
      product.price = dto.price;
    }

    if (dto.stockQuantity !== undefined) {
      product.stockQuantity = dto.stockQuantity;
    }

    if (typeof dto.isActive === 'boolean') {
      product.isActive = dto.isActive;
    }

    await this.productRepository.save(product);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.softRemove(product);
  }

  async restore(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    if (!product.deletedAt) {
      return this.findOne(id);
    }

    await this.productRepository.restore(id);

    return this.findOne(id);
  }
}
