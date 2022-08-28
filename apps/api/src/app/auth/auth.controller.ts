import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, SetMetadata, Req, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Headers } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Resource } from './decorators/resource.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtGuard } from './guards/jwt.guard';
import { ResourceGuard } from './guards/resource.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
    return {}
  }
}
