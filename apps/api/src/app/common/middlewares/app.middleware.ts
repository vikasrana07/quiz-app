import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from '../services';
import { UsersService } from '../../users/users.service';
@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private utilService: UtilService,
    private jwtService: JwtService
  ) { }
  async use(req: Request, res: Response, next: NextFunction) {
    if (req?.url?.includes('api/')) {
      const bearerToken = this.utilService.getToken(req);
      const isValid = await this.isTokenValid(bearerToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid Token!');
      }
    }
    next();
  }

  async isTokenValid(bearerToken: string): Promise<boolean> {
    const verifyOptions = { secret: this.configService.get('JWT_SECRET') };
    let isValid = false;
    try {
      const payload = await this.jwtService.verifyAsync(bearerToken, verifyOptions);
      const { username, id, iat, exp } = payload;
      const user = await this.usersService.findByUsername(username);
      if (user) {
        isValid = true;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }
    return isValid;
  }
}
