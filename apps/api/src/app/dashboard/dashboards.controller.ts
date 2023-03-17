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
  HttpStatus,
} from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ResourceGuard } from '../auth/guards/resource.guards';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post()
  @Resource('create_dashboard')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createDashboardDto: CreateDashboardDto) {
    const data = await this.dashboardsService.create(createDashboardDto);
    return {
      data: data,
      statusCode: HttpStatus.OK,
      message: 'Dashboard created successfully',
    };
  }

  @Get()
  @Resource('list_dashboard')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.dashboardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardsService.findOne(+id);
  }

  @Get(':code/:type')
  getWidgetData(@Param('code') code: string, @Param('type') type: string) {
    return this.dashboardsService.getWidgetData(code, type);
  }

  @Patch(':id')
  @Resource('update_dashboard')
  @UseGuards(JwtGuard, ResourceGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDashboardDto: UpdateDashboardDto
  ) {
    const data = await this.dashboardsService.update(+id, updateDashboardDto);
    return {
      data: data,
      statusCode: HttpStatus.OK,
      message: 'Dashboard updated successfully',
    };
  }

  @Delete(':id')
  @Resource('delete_dashboard')
  @UseGuards(JwtGuard, ResourceGuard)
  async remove(@Param('id') id: number) {
    await this.dashboardsService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Dashboard deleted successfully',
    };
  }
}
