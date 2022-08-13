import {
  Controller,
  Get,
  Patch,
  Body,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';


import { SettingsService } from './settings.service';
import { SettingsDTO } from './settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async showAllSettings() {
    const data = await this.settingsService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Settings fetched successfully',
      data
    };
  }

  @Patch()
  async updateSetting(@Body() data: Partial<SettingsDTO>) {
    await this.settingsService.update(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Setting updated successfully',
    };
  }
}