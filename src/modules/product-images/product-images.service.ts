import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { SortProductImagesDto } from './dto/sort-product-images.dto';
import { ProductImageValidator } from 'src/common/validators/product-image.validator';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly productImageValidator: ProductImageValidator,
  ) {}

  private getProductImagePath(image?: Express.Multer.File) {
    if (!image) {
      return undefined;
    }

    return `uploads/products/gallery/${image.filename}`;
  }

  async findByProduct(productId: number) {
    await this.productImageValidator.validateProductExists(productId);

    return this.productImageRepository.find({
      where: {
        productId,
        deletedAt: IsNull(),
      },
      order: {
        sortOrder: 'ASC',
        id: 'ASC',
      },
    });
  }

  async create(
    productId: number,
    createProductImageDto: CreateProductImageDto,
    image?: Express.Multer.File,
  ) {
    await this.productImageValidator.validateProductExists(productId);

    const imagePath = this.getProductImagePath(image);

    if (!imagePath) {
      throw new BadRequestException('Vui lòng chọn ảnh sản phẩm');
    }

    this.productImageValidator.validateImageUrl(imagePath);
    this.productImageValidator.validateSortOrder(
      createProductImageDto.sortOrder,
    );

    const sortOrder =
      createProductImageDto.sortOrder ??
      (await this.getNextSortOrder(productId));

    if (createProductImageDto.isPrimary) {
      await this.clearPrimaryImages(productId);
    }

    const productImage = this.productImageRepository.create({
      productId,
      imageUrl: imagePath,
      sortOrder,
      isPrimary: createProductImageDto.isPrimary ?? false,
    });

    return this.productImageRepository.save(productImage);
  }

  async createBulk(
    productId: number,
    createProductImageDto: CreateProductImageDto,
    images: Express.Multer.File[],
  ) {
    await this.productImageValidator.validateProductExists(productId);

    if (!images.length) {
      throw new BadRequestException('Vui lòng chọn ít nhất một ảnh sản phẩm');
    }

    let nextSortOrder = await this.getNextSortOrder(productId);

    const isPrimary = createProductImageDto.isPrimary ?? false;

    if (isPrimary) {
      await this.clearPrimaryImages(productId);
    }

    const productImages = images.map((image, index) => {
      const imagePath = this.getProductImagePath(image);

      if (!imagePath) {
        throw new BadRequestException('Đường dẫn ảnh sản phẩm không hợp lệ');
      }

      this.productImageValidator.validateImageUrl(imagePath);

      const sortOrder =
        createProductImageDto.sortOrder !== undefined
          ? createProductImageDto.sortOrder + index
          : nextSortOrder++;

      this.productImageValidator.validateSortOrder(sortOrder);

      return this.productImageRepository.create({
        productId,
        imageUrl: imagePath,
        sortOrder,
        isPrimary: isPrimary && index === 0,
      });
    });

    return this.productImageRepository.save(productImages);
  }

  async update(
    productId: number,
    imageId: number,
    updateProductImageDto: UpdateProductImageDto,
  ) {
    await this.productImageValidator.validateProductExists(productId);

    const image =
      await this.productImageValidator.findImageBelongsToProductOrFail(
        productId,
        imageId,
      );

    if (updateProductImageDto.imageUrl !== undefined) {
      const imageUrl = updateProductImageDto.imageUrl.trim();

      this.productImageValidator.validateImageUrl(imageUrl);
      image.imageUrl = imageUrl;
    }

    if (updateProductImageDto.sortOrder !== undefined) {
      this.productImageValidator.validateSortOrder(
        updateProductImageDto.sortOrder,
      );
      image.sortOrder = updateProductImageDto.sortOrder;
    }

    if (updateProductImageDto.isPrimary !== undefined) {
      if (updateProductImageDto.isPrimary) {
        await this.clearPrimaryImages(productId);
      }

      image.isPrimary = updateProductImageDto.isPrimary;
    }

    return this.productImageRepository.save(image);
  }

  async sort(productId: number, sortProductImagesDto: SortProductImagesDto) {
    await this.productImageValidator.validateProductExists(productId);

    const imageIds = sortProductImagesDto.items.map((item) => item.id);

    this.productImageValidator.validateImageIdsAreUnique(imageIds);

    for (const item of sortProductImagesDto.items) {
      this.productImageValidator.validateSortOrder(item.sortOrder);

      const image =
        await this.productImageValidator.findImageBelongsToProductOrFail(
          productId,
          item.id,
        );

      image.sortOrder = item.sortOrder;

      await this.productImageRepository.save(image);
    }

    return {
      message: 'Sắp xếp ảnh sản phẩm thành công',
    };
  }

  async remove(productId: number, imageId: number) {
    await this.productImageValidator.validateProductExists(productId);

    const image =
      await this.productImageValidator.findImageBelongsToProductOrFail(
        productId,
        imageId,
      );

    await this.productImageRepository.softDelete(image.id);

    return {
      message: 'Xóa ảnh sản phẩm thành công',
    };
  }

  async removeAllByProduct(productId: number) {
    await this.productImageValidator.validateProductExists(productId);

    await this.productImageRepository.softDelete({
      productId,
    });

    return {
      message: 'Xóa toàn bộ ảnh phụ của sản phẩm thành công',
    };
  }

  private async getNextSortOrder(productId: number) {
    const lastImage = await this.productImageRepository.findOne({
      where: {
        productId,
        deletedAt: IsNull(),
      },
      order: {
        sortOrder: 'DESC',
        id: 'DESC',
      },
    });

    return lastImage ? lastImage.sortOrder + 1 : 0;
  }

  private async clearPrimaryImages(productId: number) {
    await this.productImageRepository.update(
      {
        productId,
        deletedAt: IsNull(),
      },
      {
        isPrimary: false,
      },
    );
  }
}
