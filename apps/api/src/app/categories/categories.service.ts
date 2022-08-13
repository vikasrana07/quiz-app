import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(body: CategoriesDTO) {
    const username = await this.categoryRepository.findOne({ where: { name: body.name } });
    if (username != null) {
      throw new HttpException('Category already exists', HttpStatus.CONFLICT);
    } else {
      const data = this.categoryRepository.create(body);
      return await this.categoryRepository.save(data);
    }
  }

  async update(id: number, data: Partial<CategoriesDTO>) {
    await this.categoryRepository.update({ id }, data);
    return await this.categoryRepository.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    await this.categoryRepository.delete({ id: id });
    return { deleted: true };
  }
}