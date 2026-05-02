import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { ProductStatus } from 'src/common/enums/ecommerce.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';

@Injectable()
export class ProductValidator {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findProductOrFail(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return product;
  }

  async findProductWithDeletedOrFail(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return product;
  }

  async validateCategoryCanUse(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        isActive: true,
        deletedAt: IsNull(),
      },
    });

    if (!category) {
      throw new BadRequestException(
        'Danh mục không tồn tại, đã bị xóa hoặc đang bị ẩn',
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

    const existed = await this.productRepository.findOne({ where });

    if (existed) {
      throw new ConflictException('Slug sản phẩm đã tồn tại');
    }
  }

  async validateSkuUnique(sku: string, ignoreId?: number) {
    const where = ignoreId
      ? {
          sku,
          id: Not(ignoreId),
          deletedAt: IsNull(),
        }
      : {
          sku,
          deletedAt: IsNull(),
        };

    const existed = await this.productRepository.findOne({ where });

    if (existed) {
      throw new ConflictException('Mã SKU đã tồn tại');
    }
  }

  validatePrice(price: string | number) {
    const value = Number(price);

    if (Number.isNaN(value)) {
      throw new BadRequestException('Giá sản phẩm không hợp lệ');
    }

    if (value < 0) {
      throw new BadRequestException('Giá sản phẩm không được nhỏ hơn 0');
    }
  }

  validateSalePrice(
    price: string | number,
    salePrice?: string | number | null,
  ) {
    if (salePrice === null || salePrice === undefined) {
      return;
    }

    const priceValue = Number(price);
    const salePriceValue = Number(salePrice);

    if (Number.isNaN(salePriceValue)) {
      throw new BadRequestException('Giá khuyến mãi không hợp lệ');
    }

    if (salePriceValue < 0) {
      throw new BadRequestException('Giá khuyến mãi không được nhỏ hơn 0');
    }

    if (salePriceValue > priceValue) {
      throw new BadRequestException(
        'Giá khuyến mãi không được lớn hơn giá gốc',
      );
    }
  }

  validateQuantity(quantity: number) {
    if (!Number.isInteger(quantity)) {
      throw new BadRequestException('Số lượng sản phẩm phải là số nguyên');
    }

    if (quantity < 0) {
      throw new BadRequestException('Số lượng sản phẩm không được nhỏ hơn 0');
    }
  }

  validateStatus(status: ProductStatus) {
    if (!Object.values(ProductStatus).includes(status)) {
      throw new BadRequestException('Trạng thái sản phẩm không hợp lệ');
    }
  }

  async validateProductCanForceDelete(productId: number) {
    const orderItemCount = await this.orderItemRepository.count({
      where: {
        productId,
      },
      withDeleted: true,
    });

    if (orderItemCount > 0) {
      throw new BadRequestException(
        'Không thể xóa vĩnh viễn sản phẩm đã phát sinh đơn hàng',
      );
    }

    const reviewCount = await this.reviewRepository.count({
      where: {
        productId,
      },
      withDeleted: true,
    });

    if (reviewCount > 0) {
      throw new BadRequestException(
        'Không thể xóa vĩnh viễn sản phẩm đã có đánh giá',
      );
    }
  }

  validateProductIsDeleted(product: Product) {
    if (!product.deletedAt) {
      throw new BadRequestException('Sản phẩm này chưa bị xóa mềm');
    }
  }
}
