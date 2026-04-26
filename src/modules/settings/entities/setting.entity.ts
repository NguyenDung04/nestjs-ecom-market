import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { SettingValueType } from 'src/common/enums/ecommerce.enum';

@Entity('settings')
export class Setting extends BaseEntity {
  @Index('IDX_SETTINGS_KEY', { unique: true })
  @Column({ name: 'setting_key', type: 'varchar', length: 100, unique: true })
  settingKey!: string;

  @Column({ name: 'setting_value', type: 'text', nullable: true })
  settingValue!: string | null;

  @Column({
    name: 'value_type',
    type: 'enum',
    enum: SettingValueType,
    default: SettingValueType.STRING,
  })
  valueType!: SettingValueType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;
}
