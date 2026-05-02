import { SelectQueryBuilder } from 'typeorm';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';
import { QueryProductDto } from 'src/modules/products/dto/query-product.dto';
import { Product } from 'src/modules/products/entities/product.entity';

const ALLOWED_PRODUCT_SORT_FIELDS = [
  'id',
  'name',
  'slug',
  'sku',
  'price',
  'salePrice',
  'quantity',
  'status',
  'createdAt',
  'updatedAt',
] as const;

type ProductSortField = (typeof ALLOWED_PRODUCT_SORT_FIELDS)[number];
type SortOrder = 'ASC' | 'DESC';

export function getProductSortOptions(query: QueryProductDto): {
  sortBy: ProductSortField;
  sortOrder: SortOrder;
} {
  const sortBy: ProductSortField = ALLOWED_PRODUCT_SORT_FIELDS.includes(
    query.sortBy as ProductSortField,
  )
    ? (query.sortBy as ProductSortField)
    : 'createdAt';

  const sortOrder: SortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

  return {
    sortBy,
    sortOrder,
  };
}

export function applyProductFilters(
  qb: SelectQueryBuilder<Product>,
  query: QueryProductDto,
) {
  if (query.search) {
    qb.andWhere(
      '(product.name LIKE :search OR product.slug LIKE :search OR product.sku LIKE :search)',
      {
        search: `%${query.search}%`,
      },
    );
  }

  if (typeof query.categoryId === 'number') {
    qb.andWhere('product.category_id = :categoryId', {
      categoryId: query.categoryId,
    });
  }

  if (query.status) {
    qb.andWhere('product.status = :status', {
      status: query.status,
    });
  }

  if (query.minPrice !== undefined) {
    qb.andWhere('COALESCE(product.sale_price, product.price) >= :minPrice', {
      minPrice: query.minPrice,
    });
  }

  if (query.maxPrice !== undefined) {
    qb.andWhere('COALESCE(product.sale_price, product.price) <= :maxPrice', {
      maxPrice: query.maxPrice,
    });
  }

  if (typeof query.hasSale === 'boolean') {
    if (query.hasSale) {
      qb.andWhere('product.sale_price IS NOT NULL');
      qb.andWhere('product.sale_price > 0');
      qb.andWhere('product.sale_price < product.price');
    } else {
      qb.andWhere(
        '(product.sale_price IS NULL OR product.sale_price <= 0 OR product.sale_price >= product.price)',
      );
    }
  }

  return qb;
}

export function getEffectiveProductStatus(
  quantity: number,
  status?: ProductStatus,
): ProductStatus {
  if (quantity <= 0) {
    return ProductStatus.OUT_OF_STOCK;
  }

  return status ?? ProductStatus.ACTIVE;
}
