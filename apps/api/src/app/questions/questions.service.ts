import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) { }

  async showAll() {
    return await this.questionsRepository.find({ relations: ['category'] });
  }

  async create(body: CreateQuestionDto) {
    const data = this.questionsRepository.create(body);
    return await this.questionsRepository.save(data);
  }

  /* async read(id: number) {
    return await this.questionsRepository.findOne({ where: { id: id } });
  } */

  async update(id: number, data: Partial<UpdateQuestionDto>) {
    await this.questionsRepository.update({ id }, data);
    return await this.questionsRepository.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    await this.questionsRepository.delete({ id: id });
    return { deleted: true };
  }
}