import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './../../common/entities/abstract.entity';

@Entity('quizzes')
export class Quiz extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;
}
