import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { CouponType } from 'src/common/enums/ecommerce.enum';
import { Order } from '../../orders/entities/order.entity';

@Entity('coupons')
export class Coupon extends BaseEntity {
  @Index('IDX_COUPONS_CODE', { unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'enum', enum: CouponType })
  type!: CouponType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value!: string;

  @Column({
    name: 'min_order_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  minOrderAmount!: string;

  @Column({
    name: 'max_discount_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  maxDiscountAmount!: string | null;

  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit!: number | null;

  @Column({ name: 'used_count', type: 'int', default: 0 })
  usedCount!: number;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate!: Date | null;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate!: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Order, (order) => order.coupon)
  orders!: Order[];
}
