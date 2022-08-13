import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { CategoriesEntity } from './../categories/categories.entity';

@Entity('questions')
export class QuestionsEntity extends AbstractEntity {

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => CategoriesEntity, (category: CategoriesEntity) => category.id)
  @JoinColumn()
  public category: CategoriesEntity;

}