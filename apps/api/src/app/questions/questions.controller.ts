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
  UseGuards
} from '@nestjs/common';

import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ResourceGuard } from '../auth/guards/resource.guards';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) { }

  @Get()
  @Resource('list_question')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async showAllQuestions() {
    const data = await this.questionsService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Questions fetched successfully',
      data
    };
  }

  @Post()
  @Resource('create_question')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async createQuestion(@Body() body: CreateQuestionDto) {
    const data = await this.questionsService.create(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question created successfully',
      data
    };
  }

  /* @Get(':id')
  async getQuestion(@Param('id') id: number) {
    const data = await this.questionsService.read(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question fetched successfully',
      data,
    };
  } */

  @Patch(':id')
  @Resource('update_question')
  @UseGuards(JwtGuard, ResourceGuard)
  async updateQuestion(@Param('id') id: number, @Body() data: Partial<UpdateQuestionDto>) {
    await this.questionsService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question updated successfully',
    };
  }

  @Delete(':id')
  @Resource('delete_question')
  @UseGuards(JwtGuard, ResourceGuard)
  async deleteQuestion(@Param('id') id: number) {
    await this.questionsService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question deleted successfully',
    };
  }
}