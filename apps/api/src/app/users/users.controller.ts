import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException,
  UsePipes,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { UsersDTO } from './users.dto';
import { Roles } from '../roles/roles.decorator';
import Role from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async showAllUsers() {
    const data = await this.usersService.showAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() data: UsersDTO) {

    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...data,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      /* if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      } */
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /* const user = await this.UserService.create(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      user
    }; */
  }

  /* @Get(':id')
  async readUser(@Param('id') id: number) {
    const data = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data,
    };
  } */

  /* @Patch(':id')
  async uppdateUser(@Param('id') id: number, @Body() data: Partial<UsersDTO>) {
    await this.UserService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  } */

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.destroy(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}