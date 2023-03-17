import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const row = await this.roleRepo.findOne({
      where: { name: createRoleDto.name },
    });
    if (row) {
      throw new HttpException(
        'Role name already exists.',
        HttpStatus.BAD_REQUEST
      );
    }
    createRoleDto.resources = createRoleDto.resources.toString();
    const role = this.roleRepo.create(createRoleDto);
    return this.roleRepo.save(role);
  }

  findAll() {
    return this.roleRepo.find({});
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const row = await this.roleRepo.findOne({
      where: { name: updateRoleDto.name, id: Not(id) },
    });
    if (row) {
      throw new HttpException(
        'Role name already exists.',
        HttpStatus.BAD_REQUEST
      );
    }
    updateRoleDto.resources = updateRoleDto.resources.toString();
    await this.roleRepo.update({ id }, updateRoleDto);
    return await this.roleRepo.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    try {
      return await this.roleRepo.delete({ id });
    } catch (e) {
      throw new HttpException(
        'Role can not be removed.',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
