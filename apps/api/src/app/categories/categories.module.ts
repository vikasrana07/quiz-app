import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
@Module({
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([User, Category])],
  providers: [CategoriesService]
})
export class CategoriesModule { }
