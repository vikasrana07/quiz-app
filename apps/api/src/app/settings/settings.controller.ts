import {
  Controller,
  Get,
  Patch,
  Body,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { SettingsService } from './settings.service';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ResourceGuard } from '../auth/guards/resource.guards';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @Resource('list_setting')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async showAllSettings() {
    const row = await this.settingsService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Settings fetched successfully',
      params: row,
    };
  }

  @Patch()
  @Resource('update_setting')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateSetting(@Body() updateSettingDto: Partial<UpdateSettingDto>) {
    const row = await this.settingsService.update(updateSettingDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Settings updated successfully',
      params: row,
    };
  }
}
