import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoriesEntity } from './categories.entity';
import { CategoriesDTO } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoryRepository: Repository<CategoriesEntity>,
  ) { }

  async showAll() {
    return await this.categoryRepository.find();
  }

  async create(data: CategoriesDTO) {
    const user = this.categoryRepository.create(data);
    await this.categoryRepository.save(data);
    return user;
  }

  async read(id: number) {
    return await this.categoryRepository.findOne({ where: { id: id } });
  }

  /* async update(id: number, data: Partial<CategoriesDTO>) {
    await this.categoryRepository.update({ id }, data);
    return await this.categoryRepository.findOne({ id });
  } */

  async delete(id: number) {
    await this.categoryRepository.delete({ id: id });
    return { deleted: true };
  }
}