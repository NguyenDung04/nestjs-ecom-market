import { toSlug } from 'src/common/utils/slug.util';
import { getEffectiveProductStatus } from './product-query.helper';
import { CreateProductDto } from 'src/modules/products/dto/create-product.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import { UpdateProductDto } from 'src/modules/products/dto/update-product.dto';

export function normalizeCreateProductPayload(dto: CreateProductDto) {
  const name = dto.name.trim();

  const slug = dto.slug?.trim() ? toSlug(dto.slug) : toSlug(name);

  const quantity = dto.quantity ?? 0;

  return {
    categoryId: dto.categoryId,
    name,
    slug,
    sku: dto.sku.trim(),
    price: dto.price.toString(),
    salePrice:
      dto.salePrice === undefined || dto.salePrice === null
        ? null
        : dto.salePrice.toString(),
    quantity,
    shortDescription: dto.shortDescription?.trim() || null,
    description: dto.description?.trim() || null,
    thumbnail: dto.thumbnail?.trim() || null,
    status: getEffectiveProductStatus(quantity, dto.status),
  };
}

export function normalizeUpdateProductPayload(
  product: Product,
  dto: UpdateProductDto,
) {
  const name = dto.name?.trim() || product.name;

  const slug = dto.slug?.trim()
    ? toSlug(dto.slug)
    : dto.name
      ? toSlug(dto.name)
      : product.slug;

  const quantity = dto.quantity === undefined ? product.quantity : dto.quantity;

  const status =
    dto.status === undefined
      ? product.status
      : getEffectiveProductStatus(quantity, dto.status);

  return {
    categoryId:
      dto.categoryId === undefined ? product.categoryId : dto.categoryId,
    name,
    slug,
    sku: dto.sku?.trim() || product.sku,
    price: dto.price === undefined ? product.price : dto.price.toString(),
    salePrice:
      dto.salePrice === undefined
        ? product.salePrice
        : dto.salePrice === null
          ? null
          : dto.salePrice.toString(),
    quantity,
    shortDescription:
      dto.shortDescription === undefined
        ? product.shortDescription
        : dto.shortDescription?.trim() || null,
    description:
      dto.description === undefined
        ? product.description
        : dto.description?.trim() || null,
    thumbnail:
      dto.thumbnail === undefined
        ? product.thumbnail
        : dto.thumbnail?.trim() || null,
    status,
  };
}
