import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtService
  ) { }

  async loginWithCredentials(body: any) {

    try {
      const user = await this.usersService.findByUsername(body.username);

      //const hashedPassword = await bcrypt.hash("demo@123", 10);

      const isPasswordMatching = await bcrypt.compare(
        body.password,
        user.password
      );
      if (!isPasswordMatching) {
        throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
      }
      const response = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };

      return {
        ...response,
        token: this.jwtTokenService.sign(response),
      }
    } catch (e) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }


  }
}