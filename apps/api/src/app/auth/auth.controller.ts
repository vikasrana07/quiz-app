import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Headers } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generatetoken')
  generateToken(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.generateToken(createAuthDto);
  }

  @Get('validatetoken')
  @UseInterceptors(ClassSerializerInterceptor)
  validateToken(@Headers() headers) {
    return this.authService.validateToken(headers);
  }

  @Delete('logout')
  async logout() {
    return {};
  }
}
