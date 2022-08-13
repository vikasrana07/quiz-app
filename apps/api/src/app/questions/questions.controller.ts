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
  UseInterceptors
} from '@nestjs/common';

import { QuestionsService } from './questions.service';
import { QuestionsDTO } from './questions.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) { }

  @Get()
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
  @UseInterceptors(ClassSerializerInterceptor)
  async createQuestion(@Body() body: QuestionsDTO) {
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
  async updateQuestion(@Param('id') id: number, @Body() data: Partial<QuestionsDTO>) {
    await this.questionsService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question updated successfully',
    };
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number) {
    await this.questionsService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question deleted successfully',
    };
  }
}