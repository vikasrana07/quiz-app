import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { Resource } from './../auth/decorators/resource.decorator';
import { JwtGuard } from './../auth/guards/jwt.guard';
import { ResourceGuard } from './../auth/guards/resource.guards';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  @Resource('create_user')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createWidgetDto: CreateWidgetDto) {
    return this.widgetsService.create(createWidgetDto);
  }

  @Get()
  @Resource('list_user')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.widgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.widgetsService.findOne(+id);
  }

  @Patch(':id')
  @Resource('update_widget')
  @UseGuards(JwtGuard, ResourceGuard)
  update(@Param('id') id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
    return this.widgetsService.update(+id, updateWidgetDto);
  }

  @Delete(':id')
  @Resource('delete_user')
  @UseGuards(JwtGuard, ResourceGuard)
  remove(@Param('id') id: string) {
    return this.widgetsService.remove(+id);
  }
}
