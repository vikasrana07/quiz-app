import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SettingsEntity } from './settings.entity';
import { SettingsDTO } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private settingsRepository: Repository<SettingsEntity>,
  ) { }

  async showAll() {
    return await this.settingsRepository.find();
  }

  async update(data: Partial<SettingsDTO>) {
    return await this.settingsRepository.upsert(data, ["key"]);
  }
}