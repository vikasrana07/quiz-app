import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  /*  @Column()
    @Exclude()
    @Generated("uuid")
    public uuid: string; */

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  public updatedAt: Date;
}
