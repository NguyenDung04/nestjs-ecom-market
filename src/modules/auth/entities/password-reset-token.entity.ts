import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken extends BaseEntity {
  @Index('IDX_PASSWORD_RESET_TOKENS_USER_ID')
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Index('IDX_PASSWORD_RESET_TOKENS_EMAIL')
  @Column({ type: 'varchar', length: 150 })
  email!: string;

  @Index('IDX_PASSWORD_RESET_TOKENS_TOKEN_HASH', { unique: true })
  @Column({ name: 'token_hash', type: 'varchar', length: 255, unique: true })
  tokenHash!: string;

  @Index('IDX_PASSWORD_RESET_TOKENS_EXPIRES_AT')
  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt!: Date;

  @Column({ name: 'used_at', type: 'datetime', nullable: true })
  usedAt!: Date | null;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
