import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from './users.entity';
import { UsersDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) { }

  async showAll() {
    return await this.usersRepository.find();
  }

  async create(data: UsersDTO) {
    const username = await this.usersRepository.findOne({ where: { username: data.username } });
    const email = await this.usersRepository.findOne({ where: { email: data.email } });
    if (username != null) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    } else if (email != null) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    } else {
      const user = this.usersRepository.create(data);
      await this.usersRepository.save(data);
      return user;
    }
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username: username } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async findOne(key: string, value: string) {
    const user = await this.usersRepository.findOne({ where: { username: value } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  /* async update(id: number, data: Partial<UsersDTO>) {
    await this.usersRepository.update({ id }, data);
    return await this.usersRepository.findOne({ id });
  } */

  async destroy(id: number) {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }
}