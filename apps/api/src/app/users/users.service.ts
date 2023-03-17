import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './../roles/entities/role.entity';
import { Repository, Not } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const username = await this.userRepo.findOne({
      where: { username: createUserDto.username },
    });
    const email = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (username != null) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    } else if (email != null) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    } else {
      const { roles, ...dataInsert } = createUserDto;

      const userRoles = await Promise.all(
        roles.map((role) => {
          return this.roleRepo.findOne({ where: { id: +role } });
        })
      );
      const userToSave = this.userRepo.create({
        ...dataInsert,
        roles: userRoles,
      });

      return this.userRepo.save(userToSave);
    }
  }

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id: id } });
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    const username = await this.userRepo.findOne({
      where: { username: updateUserDto.username, id: Not(id) },
    });
    const email = await this.userRepo.findOne({
      where: { email: updateUserDto.email, id: Not(id) },
    });
    if (username != null) {
      throw new HttpException(
        'Username already exists.',
        HttpStatus.BAD_REQUEST
      );
    } else if (email != null) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    } else {
      const { roles, ...dataUpdate } = updateUserDto;
      const userRoles = await Promise.all(
        roles.map((role) => {
          return this.roleRepo.findOne({ where: { id: +role } });
        })
      );
      const userToUpdate = this.userRepo.create({
        ...dataUpdate,
        id: id,
        roles: userRoles,
      });
      return await this.userRepo.save(userToUpdate);
    }
  }

  async remove(id: number) {
    await this.userRepo.delete({ id: id });
    return { deleted: true };
  }

  async findByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username: username } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }
}
