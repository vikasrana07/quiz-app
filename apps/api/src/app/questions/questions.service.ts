import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionsEntity } from './questions.entity';
import { QuestionsDTO } from './questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private questionsRepository: Repository<QuestionsEntity>,
  ) { }

  async showAll() {
    return await this.questionsRepository.find({ relations: ['category'] });
  }

  async create(body: QuestionsDTO) {
    const data = this.questionsRepository.create(body);
    return await this.questionsRepository.save(data);
  }

  /* async read(id: number) {
    return await this.questionsRepository.findOne({ where: { id: id } });
  } */

  async update(id: number, data: Partial<QuestionsDTO>) {
    await this.questionsRepository.update({ id }, data);
    return await this.questionsRepository.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    await this.questionsRepository.delete({ id: id });
    return { deleted: true };
  }
}