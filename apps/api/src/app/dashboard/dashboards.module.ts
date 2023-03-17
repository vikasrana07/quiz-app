import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Dashboard } from './entities/dashboard.entity';
import { Category } from '../categories/entities/category.entity';
import { Question } from '../questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Question, Dashboard])],
  controllers: [DashboardsController],
  providers: [DashboardsService],
})
export class DashboardsModule {}
