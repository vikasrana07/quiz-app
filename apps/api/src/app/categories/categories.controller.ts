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
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CategoriesDTO } from './categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async showAllCategories() {
    const data = await this.categoriesService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Categories fetched successfully',
      data
    };
  }

  @Post()
  async createCategory(@Body() body: CategoriesDTO) {
    const data = await this.categoriesService.create(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category created successfully',
      data
    };
  }

  @Patch(':id')
  async updateCategory(@Param('id') id: number, @Body() data: Partial<CategoriesDTO>) {
    await this.categoriesService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    await this.categoriesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category deleted successfully',
    };
  }
}