import { Exclude } from 'class-transformer';
import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import Role from '../roles/roles.enum';

@Entity('users')
export class UsersEntity extends AbstractEntity {

  @Column({
    type: 'varchar',
    nullable: false
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  email: string;


  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public role: Role

  @Column()
  @Exclude()
  public password: string;

}