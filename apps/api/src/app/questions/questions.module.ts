import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
@Module({
  controllers: [QuestionsController],
  imports: [TypeOrmModule.forFeature([User, Question])],
  providers: [QuestionsService]
})
export class QuestionsModule { }
