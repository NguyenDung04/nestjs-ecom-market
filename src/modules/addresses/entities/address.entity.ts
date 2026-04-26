import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'receiver_name', type: 'varchar', length: 150 })
  receiverName!: string;

  @Column({ name: 'receiver_phone', type: 'varchar', length: 20 })
  receiverPhone!: string;

  @Column({ type: 'varchar', length: 100 })
  province!: string;

  @Column({ type: 'varchar', length: 100 })
  district!: string;

  @Column({ type: 'varchar', length: 100 })
  ward!: string;

  @Column({ name: 'address_detail', type: 'varchar', length: 255 })
  addressDetail!: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault!: boolean;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
