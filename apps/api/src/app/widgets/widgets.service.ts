import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { Widget } from './entities/widget.entity';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(Widget)
    private widgetRepo: Repository<Widget>
  ) {}
  async create(createWidgetDto: CreateWidgetDto) {
    const userToSave = this.widgetRepo.create(createWidgetDto);
    return this.widgetRepo.save(userToSave);
  }

  findAll() {
    return this.widgetRepo.find({ relations: ['roles'] });
  }

  findOne(id: number) {
    return this.widgetRepo.findOne({ where: { id: id } });
  }

  async update(id: number, updateWidgetDto: UpdateWidgetDto) {
    await this.widgetRepo.update({ id }, updateWidgetDto);
    return await this.widgetRepo.findOne({ where: { id: id } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByUsername(name: string) {
    const user = await this.widgetRepo.findOne({ where: { name: name } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }
}
