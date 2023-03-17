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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Resource } from './../auth/decorators/resource.decorator';
import { JwtGuard } from './../auth/guards/jwt.guard';
import { ResourceGuard } from './../auth/guards/resource.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Resource('create_user')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    const row = await this.usersService.create(createUserDto);
    return {
      params: row,
      message: 'User created successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @Resource('list_user')
  @UseGuards(JwtGuard, ResourceGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Resource('update_user')
  @UseGuards(JwtGuard, ResourceGuard)
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<UpdateUserDto>
  ) {
    const row = await this.usersService.update(+id, updateUserDto);
    return {
      params: row,
      message: 'User updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @Resource('delete_user')
  @UseGuards(JwtGuard, ResourceGuard)
  async remove(@Param('id') id: string) {
    const row = await this.usersService.remove(+id);
    return {
      message: 'User deleted successfully',
      data: row,
    };
  }
}
