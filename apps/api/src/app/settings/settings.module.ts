import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsEntity } from './settings.entity';
import { SettingsService } from './settings.service';
@Module({
  controllers: [SettingsController],
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  providers: [SettingsService]
})
export class SettingsModule { }
