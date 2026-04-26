import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { InventoryLogType } from 'src/common/enums/ecommerce.enum';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('inventory_logs')
export class InventoryLog extends BaseEntity {
  @Column({ name: 'product_id', type: 'int' })
  productId!: number;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId!: number | null;

  @Column({ type: 'enum', enum: InventoryLogType })
  type!: InventoryLogType;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'quantity_before', type: 'int', default: 0 })
  quantityBefore!: number;

  @Column({ name: 'quantity_after', type: 'int', default: 0 })
  quantityAfter!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string | null;

  @ManyToOne(() => Product, (product) => product.inventoryLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => User, (user) => user.inventoryLogs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
