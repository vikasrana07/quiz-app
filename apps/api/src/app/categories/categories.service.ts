import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async showAll() {
    return await this.categoryRepository.find();
  }

  async create(body: CreateCategoryDto) {
    const username = await this.categoryRepository.findOne({ where: { name: body.name } });
    if (username != null) {
      throw new HttpException('Category already exists', HttpStatus.CONFLICT);
    } else {
      const data = this.categoryRepository.create(body);
      return await this.categoryRepository.save(data);
    }
  }

  async update(id: number, updateCategoryDto: Partial<UpdateCategoryDto>) {
    const row = await this.categoryRepository.findOne({ where: { name: updateCategoryDto.name, id: Not(id) } });
    if (row) {
      throw new HttpException('Category already exists.', HttpStatus.BAD_REQUEST);
    }
    await this.categoryRepository.update({ id }, updateCategoryDto);
    return await this.categoryRepository.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    await this.categoryRepository.delete({ id: id });
    return { deleted: true };
  }
}