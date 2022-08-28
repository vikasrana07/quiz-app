import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { AbstractEntity } from './../../common/entities/abstract.entity';

@Entity('questions')
export class Question extends AbstractEntity {

  @Column()
  question: string;

  @Column()
  options: string;

  @Column()
  answer: string;

  @ManyToOne(() => Category, (category: Category) => category.id)
  @JoinColumn()
  public category: Category;

}