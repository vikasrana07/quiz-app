import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  // @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() body: AuthDTO) {
    return this.authService.loginWithCredentials(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  getUserInfo(@Body() body) {
    return body
  }

}