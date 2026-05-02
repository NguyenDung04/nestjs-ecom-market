import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import {
  buildPaginatedResponse,
  getPaginationParams,
} from 'src/common/utils/pagination.util';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { ProductValidator } from 'src/common/validators/product.validator';
import {
  applyProductFilters,
  getEffectiveProductStatus,
  getProductSortOptions,
} from 'src/common/helpers/product/product-query.helper';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';
import {
  normalizeCreateProductPayload,
  normalizeUpdateProductPayload,
} from 'src/common/helpers/product/product-normalizer.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly productValidator: ProductValidator,
  ) {}

  private getProductThumbnailPath(thumbnail?: Express.Multer.File) {
    if (!thumbnail) {
      return undefined;
    }

    return `uploads/products/${thumbnail.filename}`;
  }

  async findAll(query: QueryProductDto) {
    const { page, limit, skip } = getPaginationParams(query.page, query.limit);
    const { sortBy, sortOrder } = getProductSortOptions(query);

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.deleted_at IS NULL');

    applyProductFilters(qb, query);

    qb.orderBy(`product.${sortBy}`, sortOrder)
      .addOrderBy('images.sortOrder', 'ASC')
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await qb.getManyAndCount();

    return buildPaginatedResponse(items, totalItems, page, limit);
  }

  async findActive() {
    return this.productRepository.find({
      where: {
        status: ProductStatus.ACTIVE,
        deletedAt: IsNull(),
      },
      relations: {
        category: true,
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      relations: {
        category: true,
        images: true,
        reviews: true,
      },
    });

    if (!product) {
      return this.productValidator.findProductOrFail(id);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: {
        slug,
        deletedAt: IsNull(),
      },
      relations: {
        category: true,
        images: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return product;
  }

  async create(
    createProductDto: CreateProductDto,
    thumbnail?: Express.Multer.File,
  ) {
    const payload = normalizeCreateProductPayload(createProductDto);

    const thumbnailPath = this.getProductThumbnailPath(thumbnail);

    if (thumbnailPath) {
      payload.thumbnail = thumbnailPath;
    }

    await this.productValidator.validateCategoryCanUse(payload.categoryId);
    await this.productValidator.validateSlugUnique(payload.slug);
    await this.productValidator.validateSkuUnique(payload.sku);

    this.productValidator.validatePrice(payload.price);
    this.productValidator.validateSalePrice(payload.price, payload.salePrice);
    this.productValidator.validateQuantity(payload.quantity);
    this.productValidator.validateStatus(payload.status);

    const product = this.productRepository.create(payload);

    return this.productRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    thumbnail?: Express.Multer.File,
  ) {
    const product = await this.productValidator.findProductOrFail(id);

    const payload = normalizeUpdateProductPayload(product, updateProductDto);

    const thumbnailPath = this.getProductThumbnailPath(thumbnail);

    if (thumbnailPath) {
      payload.thumbnail = thumbnailPath;
    }

    await this.productValidator.validateCategoryCanUse(payload.categoryId);
    await this.productValidator.validateSlugUnique(payload.slug, id);
    await this.productValidator.validateSkuUnique(payload.sku, id);

    this.productValidator.validatePrice(payload.price);
    this.productValidator.validateSalePrice(payload.price, payload.salePrice);
    this.productValidator.validateQuantity(payload.quantity);
    this.productValidator.validateStatus(payload.status);

    Object.assign(product, payload);

    return this.productRepository.save(product);
  }

  async updateStatus(
    id: number,
    updateProductStatusDto: UpdateProductStatusDto,
  ) {
    const product = await this.productValidator.findProductOrFail(id);

    const nextStatus = getEffectiveProductStatus(
      product.quantity,
      updateProductStatusDto.status,
    );

    this.productValidator.validateStatus(nextStatus);

    product.status = nextStatus;

    return this.productRepository.save(product);
  }

  async softDelete(id: number) {
    const product = await this.productValidator.findProductOrFail(id);

    await this.productRepository.softDelete(product.id);

    return {
      message: 'Xóa mềm sản phẩm thành công',
    };
  }

  async restore(id: number) {
    const product =
      await this.productValidator.findProductWithDeletedOrFail(id);

    this.productValidator.validateProductIsDeleted(product);

    await this.productRepository.restore(id);

    return {
      message: 'Khôi phục sản phẩm thành công',
    };
  }

  async forceDelete(id: number) {
    const product =
      await this.productValidator.findProductWithDeletedOrFail(id);

    await this.productValidator.validateProductCanForceDelete(product.id);

    await this.productRepository.delete(id);

    return {
      message: 'Xóa vĩnh viễn sản phẩm thành công',
    };
  }
}
