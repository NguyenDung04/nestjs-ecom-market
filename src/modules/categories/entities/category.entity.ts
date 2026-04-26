import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Index('IDX_CATEGORIES_NAME', { unique: true })
  @Column({ type: 'varchar', length: 120, unique: true })
  name!: string;

  @Index('IDX_CATEGORIES_SLUG', { unique: true })
  @Column({ type: 'varchar', length: 150, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
