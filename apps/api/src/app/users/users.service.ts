import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './../roles/entities/role.entity';
import { Repository } from 'typeorm';
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
  ) {

  }
  async create(createUserDto: CreateUserDto) {
    const { roles, ...dataInsert } = createUserDto;

    let userRoles = await Promise.all(
      roles.map(role => {
        return this.roleRepo.findOne({ where: { name: role } });
      })
    );
    userRoles = userRoles.filter(role => role);

    const userToSave = this.userRepo.create({
      ...dataInsert,
      roles: userRoles
    });

    return this.userRepo.save(userToSave);
  }

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id: id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username: username } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }
}
