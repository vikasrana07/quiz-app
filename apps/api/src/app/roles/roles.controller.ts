import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ResourceGuard } from '../auth/guards/resource.guards';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Resource('create_role')
  @UseGuards(JwtGuard, ResourceGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const row = await this.rolesService.create(createRoleDto);
    return {
      message: 'Role created successfully',
      data: row,
    };
  }

  @Get()
  @Resource('list_role')
  @UseGuards(JwtGuard, ResourceGuard)
  findAll() {
    return this.rolesService.findAll();
  }

  @Patch(':id')
  @Resource('update_role')
  @UseGuards(JwtGuard, ResourceGuard)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const row = await this.rolesService.update(+id, updateRoleDto);
    return {
      message: 'Role updated successfully',
      data: row,
    };
  }

  @Delete(':id')
  @Resource('delete_role')
  @UseGuards(JwtGuard, ResourceGuard)
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(+id);
    return {
      message: 'Role deleted successfully',
    };
  }
}
