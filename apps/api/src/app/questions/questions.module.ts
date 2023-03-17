import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { QuestionType } from './entities/question-type.entity';
import { Question } from './entities/question.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
@Module({
  controllers: [QuestionsController],
  imports: [TypeOrmModule.forFeature([User, Question, QuestionType])],
  providers: [QuestionsService],
})
export class QuestionsModule {}
