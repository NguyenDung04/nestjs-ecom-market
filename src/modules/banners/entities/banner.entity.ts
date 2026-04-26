import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('banners')
export class Banner extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageUrl!: string;

  @Column({ name: 'link_url', type: 'varchar', length: 255, nullable: true })
  linkUrl!: string | null;

  @Column({ type: 'varchar', length: 60, default: 'home' })
  position!: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;
}
