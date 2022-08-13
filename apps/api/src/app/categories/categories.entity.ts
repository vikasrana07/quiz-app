import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';

@Entity('categories')
export class CategoriesEntity extends AbstractEntity {

  @Column({ unique: true })
  name: string;

}