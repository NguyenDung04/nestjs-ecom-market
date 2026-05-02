import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/modules/product-images/entities/product-image.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProductImageValidator {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async validateProductExists(productId: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        deletedAt: IsNull(),
      },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    return product;
  }

  async findImageOrFail(imageId: number) {
    const image = await this.productImageRepository.findOne({
      where: {
        id: imageId,
        deletedAt: IsNull(),
      },
    });

    if (!image) {
      throw new NotFoundException('Không tìm thấy ảnh sản phẩm');
    }

    return image;
  }

  async findImageBelongsToProductOrFail(productId: number, imageId: number) {
    const image = await this.productImageRepository.findOne({
      where: {
        id: imageId,
        productId,
        deletedAt: IsNull(),
      },
    });

    if (!image) {
      throw new NotFoundException(
        'Không tìm thấy ảnh sản phẩm hoặc ảnh không thuộc sản phẩm này',
      );
    }

    return image;
  }

  validateImageUrl(imageUrl?: string | null) {
    if (!imageUrl || !imageUrl.trim()) {
      throw new BadRequestException(
        'Đường dẫn ảnh sản phẩm không được để trống',
      );
    }

    if (imageUrl.length > 255) {
      throw new BadRequestException(
        'Đường dẫn ảnh sản phẩm không được vượt quá 255 ký tự',
      );
    }
  }

  validateSortOrder(sortOrder?: number | null) {
    if (sortOrder === undefined || sortOrder === null) {
      return;
    }

    if (!Number.isInteger(sortOrder)) {
      throw new BadRequestException('Thứ tự ảnh phải là số nguyên');
    }

    if (sortOrder < 0) {
      throw new BadRequestException('Thứ tự ảnh không được nhỏ hơn 0');
    }
  }

  validateImageIdsAreUnique(imageIds: number[]) {
    const uniqueIds = new Set(imageIds);

    if (uniqueIds.size !== imageIds.length) {
      throw new BadRequestException(
        'Danh sách ảnh sắp xếp không được có ID trùng nhau',
      );
    }
  }
}
