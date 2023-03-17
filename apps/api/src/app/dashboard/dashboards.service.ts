import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Question } from '../questions/entities/question.entity';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    @InjectRepository(Question)
    private questionRepo: Repository<Question>,

    @InjectRepository(Dashboard)
    private dashboardRepo: Repository<Dashboard>
  ) {}
  async create(createDashboardDto: CreateDashboardDto) {
    createDashboardDto.modifiedBy = createDashboardDto.createdBy;
    const dataToSave = this.dashboardRepo.create(createDashboardDto);
    return this.dashboardRepo.save(dataToSave);
  }

  findAll() {
    return this.dashboardRepo.find({ relations: ['widgets'] });
  }

  findOne(id: number) {
    return this.dashboardRepo.findOne({ where: { id: id } });
  }

  async getWidgetData(code: string, type: string) {
    const response = {
      total: 0,
    };
    if (code == 'categories') {
      response.total = await this.categoryRepo.count();
    } else if (code == 'questions') {
      response.total = await this.questionRepo.count();
    }
    return response;
  }

  async update(id: number, updateDashboardDto: UpdateDashboardDto) {
    /* const row = await this.dashboardRepo.findOne({ where: { name: updateDashboardDto.name, id: Not(id) } });
    if (row) {
      throw new HttpException('Category already exists.', HttpStatus.BAD_REQUEST);
    } */
    await this.dashboardRepo.update({ id }, updateDashboardDto);
    return await this.dashboardRepo.findOne({ where: { id: id } });
  }

  async delete(id: number) {
    await this.dashboardRepo.delete({ id: id });
    return { deleted: true };
  }

  async findByUsername(name: string) {
    const user = await this.dashboardRepo.findOne({ where: { name: name } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }
}
