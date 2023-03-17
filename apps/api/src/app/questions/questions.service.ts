import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Question } from './entities/question.entity';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionType } from './entities/question-type.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepo: Repository<Question>,

    @InjectRepository(QuestionType)
    private questionsTypeRepo: Repository<QuestionType>
  ) {}

  async showAll() {
    return await this.questionsRepo.find({
      relations: ['category', 'questionType'],
    });
  }

  async showAllQuestionTypes() {
    return await this.questionsTypeRepo.find();
  }

  async create(createQuestionDto: CreateQuestionDto) {
    const row = await this.questionsRepo.findOne({
      where: { question: createQuestionDto.question },
    });
    if (row != null) {
      throw new HttpException('Question already exists', HttpStatus.CONFLICT);
    }
    const data = this.questionsRepo.create(createQuestionDto);
    return await this.questionsRepo.save(data);
  }

  /* async read(id: number) {
    return await this.questionsRepo.findOne({ where: { id: id } });
  } */

  async update(id: number, updateQuestionDto: Partial<UpdateQuestionDto>) {
    const row = await this.questionsRepo.findOne({
      where: { question: updateQuestionDto.question, id: Not(id) },
    });
    if (row) {
      throw new HttpException(
        'Question already exists.',
        HttpStatus.BAD_REQUEST
      );
    }
    await this.questionsRepo.update({ id }, updateQuestionDto);
    return await this.questionsRepo.findOne({
      where: { id: id },
      relations: ['category', 'questionType'],
    });
  }

  async delete(id: number) {
    await this.questionsRepo.delete({ id: id });
    return { deleted: true };
  }
}
