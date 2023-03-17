import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
@Module({
  controllers: [SettingsController],
  imports: [TypeOrmModule.forFeature([User, Setting])],
  providers: [SettingsService],
})
export class SettingsModule {}
