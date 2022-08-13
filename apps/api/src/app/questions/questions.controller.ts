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
  async createUsers(@Body() data: QuestionsDTO) {
    const user = await this.questionsService.create(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      user
    };
  }

  @Get(':id')
  async readUser(@Param('id') id: number) {
    const data = await this.questionsService.read(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data,
    };
  }

  /* @Patch(':id')
  async uppdateUser(@Param('id') id: number, @Body() data: Partial<QuestionsDTO>) {
    await this.questionsService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  } */

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number) {
    await this.questionsService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question deleted successfully',
    };
  }
}