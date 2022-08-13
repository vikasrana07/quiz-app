import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';

@Entity('settings')
export class SettingsEntity extends AbstractEntity {

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  key: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  value: string;

}