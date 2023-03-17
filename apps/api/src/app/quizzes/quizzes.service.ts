import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>
  ) {}

  async showAll() {
    return await this.quizRepo.find();
  }

  async create(createQuizDto: CreateQuizDto) {
    const row = await this.quizRepo.findOne({
      where: { name: createQuizDto.name },
    });
    if (row != null) {
      throw new HttpException('Quiz already exists', HttpStatus.CONFLICT);
    } else {
      const data = this.quizRepo.create(createQuizDto);
      return await this.quizRepo.save(data);
    }
  }

  async update(id: number, updateQuizDto: Partial<UpdateQuizDto>) {
    const row = await this.quizRepo.findOne({
      where: { name: updateQuizDto.name, id: Not(id) },
    });
    if (row) {
      throw new HttpException('Quiz already exists.', HttpStatus.BAD_REQUEST);
    }
    await this.quizRepo.update({ id }, updateQuizDto);
    return await this.quizRepo.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    await this.quizRepo.delete({ id: id });
    return { deleted: true };
  }
}
