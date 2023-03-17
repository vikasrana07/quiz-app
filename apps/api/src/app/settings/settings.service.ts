import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>
  ) {}

  async showAll() {
    return await this.settingsRepository.find();
  }

  async update(updateSettingDto: Partial<UpdateSettingDto>) {
    return await this.settingsRepository.upsert(updateSettingDto, ['key']);
  }
}
