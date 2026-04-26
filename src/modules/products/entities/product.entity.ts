import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Index('IDX_PRODUCTS_NAME')
  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Index('IDX_PRODUCTS_SLUG', { unique: true })
  @Column({ type: 'varchar', length: 200, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price!: string;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'category_id', type: 'int' })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}
