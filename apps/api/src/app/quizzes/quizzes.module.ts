import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { QuizzesController } from './quizzes.controller';
import { Quiz } from './entities/quiz.entity';
import { QuizzesService } from './quizzes.service';
@Module({
  controllers: [QuizzesController],
  imports: [TypeOrmModule.forFeature([User, Quiz])],
  providers: [QuizzesService],
})
export class QuizzesModule {}
