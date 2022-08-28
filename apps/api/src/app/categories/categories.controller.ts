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

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ResourceGuard } from '../auth/guards/resource.guards';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) { }

  @Get()
  @Resource('list_category')
  @UseGuards(JwtGuard, ResourceGuard)
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
  @Resource('create_category')
  @UseGuards(JwtGuard, ResourceGuard)
  async createCategory(@Body() body: CreateCategoryDto) {
    const data = await this.categoriesService.create(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category created successfully',
      data
    };
  }

  @Patch(':id')
  @Resource('update_category')
  @UseGuards(JwtGuard, ResourceGuard)
  async updateCategory(@Param('id') id: number, @Body() data: Partial<CreateCategoryDto>) {
    await this.categoriesService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  @Resource('delete_category')
  @UseGuards(JwtGuard, ResourceGuard)
  async deleteCategory(@Param('id') id: number) {
    await this.categoriesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category deleted successfully',
    };
  }
}