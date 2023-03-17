import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Dashboard } from '../../dashboard/entities/dashboard.entity';

@Entity({ name: 'widgets' })
export class Widget {
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
  code: string;

  @Column({
    type: 'varchar',
  })
  type: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  rows: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  cols: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  xpos: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  ypos: number;

  @ManyToOne(() => Dashboard, (dashboard) => dashboard.widgets)
  dashboard: Dashboard;
  /* @JoinTable({ name: 'users_roles' })
  @ManyToMany(() => Widget, widgets => widgets.dashboards, { cascade: true })
  widgets: Widget[]; */
}
