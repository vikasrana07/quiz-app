import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './../../common/entities/abstract.entity';

@Entity('settings')
export class Setting extends AbstractEntity {
  @Column({ unique: true })
  key: string;

  @Column({ unique: true })
  value: string;
}
