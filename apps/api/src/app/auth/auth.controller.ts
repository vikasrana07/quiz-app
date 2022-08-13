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
import { jwtConstants } from "../common/constants";
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
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

  @Get('validateToken')
  async validateToken() {
    //private async isTokenValid(bearerToken: string): Promise<boolean> {
    const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTZlNmY1ZTQtYTMwYi00MGFkLWI5MzAtM2RkYTI0ZTk4YzFmIiwidXNlcm5hbWUiOiJ2aWthcyIsImVtYWlsIjoidmlrYXMucmFuYUBjbG91ZHNtYXJ0ei5uZXQiLCJmaXJzdE5hbWUiOiJWaWthcyIsImxhc3ROYW1lIjoiUmFuYSIsImlhdCI6MTY2MDMwODc0NiwiZXhwIjoxNjYwMzIzMTQ2fQ.2X_JxxOog10aln9Dk8vncU0l3Zvt2fFBvscIzQxMcn8";
    const verifyOptions = { secret: jwtConstants.secret };
    const isValid = false;
    try {
      const payload = await this.jwtService.verifyAsync(bearerToken, verifyOptions);
      const { username, typeid, iat, exp } = payload;
      console.log(username, typeid, iat, exp)
      /* let user: User = new User();
      const filterDto: UserDataDto = { username: username }
      const users = await this.userService.getUsers(filterDto);
      user = users[0];

      if ((user) && (typeid < 3)) {
        isValid = true;
      }*/

    } catch (error) {
      //throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
    return isValid;

  }
}