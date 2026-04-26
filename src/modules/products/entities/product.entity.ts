import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from '../../product-images/entities/product-image.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Review } from '../../reviews/entities/review.entity';
import { InventoryLog } from '../../inventory-logs/entities/inventory-log.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId!: number | null;

  @Index('IDX_PRODUCTS_NAME')
  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Index('IDX_PRODUCTS_SLUG', { unique: true })
  @Column({ type: 'varchar', length: 220, unique: true })
  slug!: string;

  @Index('IDX_PRODUCTS_SKU', { unique: true })
  @Column({ type: 'varchar', length: 80, unique: true })
  sku!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price!: string;

  @Column({
    name: 'sale_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  salePrice!: string | null;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({
    name: 'short_description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  shortDescription!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail!: string | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category | null;

  @OneToMany(() => ProductImage, (image) => image.product)
  images!: ProductImage[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];

  @OneToMany(() => InventoryLog, (inventoryLog) => inventoryLog.product)
  inventoryLogs!: InventoryLog[];
}
