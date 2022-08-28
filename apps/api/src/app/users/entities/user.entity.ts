import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  @Exclude()
  password: string;

  @JoinTable({ name: 'users_roles' })
  @ManyToMany(() => Role, roles => roles.users, { cascade: true })
  roles: Role[];

  @BeforeInsert()
  private(): void {
    const salt = bcrypt.genSaltSync(12);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}