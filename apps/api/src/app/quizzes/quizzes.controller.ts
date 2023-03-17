import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ResourceGuard } from '../auth/guards/resource.guards';

@Controller('quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Get()
  @Resource('list_quiz')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async showAllQuizzes() {
    const row = await this.quizzesService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Quiz fetched successfully',
      params: row,
    };
  }

  @Post()
  @Resource('create_quiz')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    const row = await this.quizzesService.create(createQuizDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Quiz created successfully',
      params: row,
    };
  }

  @Patch(':id')
  @Resource('update_quiz')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateQuiz(
    @Param('id') id: number,
    @Body() updateQuizDto: Partial<UpdateQuizDto>
  ) {
    const row = await this.quizzesService.update(id, updateQuizDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Quiz updated successfully',
      params: row,
    };
  }

  @Delete(':id')
  @Resource('delete_quiz')
  @UseGuards(JwtGuard, ResourceGuard)
  async deleteQuiz(@Param('id') id: number) {
    await this.quizzesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Quiz deleted successfully',
    };
  }
}
