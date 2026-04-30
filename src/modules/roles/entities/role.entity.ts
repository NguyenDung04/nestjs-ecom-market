import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { RoleName } from 'src/common/enums/ecommerce.enum';

@Entity('roles')
export class Role extends BaseEntity {
  @Index('IDX_ROLES_NAME', { unique: true })
  @Column({ type: 'varchar', length: 60, unique: true })
  name!: RoleName;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
