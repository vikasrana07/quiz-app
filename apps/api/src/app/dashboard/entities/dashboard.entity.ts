import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Widget } from '../../widgets/entities/widget.entity';

export type EnumType = 0 | 1;

@Entity({ name: 'dashboards' })
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: [0, 1],
    default: 0,
  })
  isPrimary: EnumType;

  @Column({
    type: 'enum',
    enum: [0, 1],
    default: 0,
  })
  isLocked: EnumType;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @Exclude()
  createdBy: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  @Exclude()
  modifiedBy: string;

  @ManyToOne(() => User, (user) => user.dashboards)
  @JoinColumn({ name: 'createdBy' })
  user: User;

  @OneToMany(() => Widget, (widget) => widget.dashboard)
  widgets: Widget[];
}
