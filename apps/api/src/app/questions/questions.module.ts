import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsEntity } from './questions.entity';
import { QuestionsService } from './questions.service';
@Module({
  controllers: [QuestionsController],
  imports: [TypeOrmModule.forFeature([QuestionsEntity])],
  providers: [QuestionsService]
})
export class QuestionsModule { }
