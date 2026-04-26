import { Column, Entity, Index } from 'typeorm';
import { UserRole } from '../../../common/enums/role.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Index('IDX_USERS_EMAIL', { unique: true })
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Index('IDX_USERS_USERNAME', { unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({
    name: 'reset_password_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  resetPasswordToken!: string | null;

  @Column({
    name: 'reset_password_expires_at',
    type: 'datetime',
    nullable: true,
  })
  resetPasswordExpiresAt!: Date | null;
}
