import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './../../common/entities/abstract.entity';

@Entity('questions_types')
export class QuestionType extends AbstractEntity {
  @Column({ unique: true })
  name: string;
}
