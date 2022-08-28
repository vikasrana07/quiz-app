import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '../common/services';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
    private utilService: UtilService,
    private jwtService: JwtService
  ) { }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async validateCredentials(username: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username: username } });

    if (!(user instanceof User)) {
      throw new Error('Invalid user')
    }

    return bcrypt.compare(password, user.password);
  }

  async generateToken(createAuthDto: CreateAuthDto) {
    try {
      const isValid = await this.validateCredentials(createAuthDto.username, createAuthDto.password);
      if (!isValid) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED,);
      }

      const user = await this.userRepository.findOne({ where: { username: createAuthDto.username } });
      const payload = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
      return { token: this.jwtService.sign({ payload }) };
    } catch (err) {
      console.log('Failed to authenticate user', err)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED,);
    }
  }

  async validateToken(headers: Headers) {
    let bearerToken = null;
    if (headers["authorization"] && headers["authorization"].split(" ")[0] === "Bearer") {
      bearerToken = headers["authorization"].split(" ")[1];
    }
    const verifyOptions = { secret: this.configService.get('JWT_SECRET') };
    try {
      const payload = await this.jwtService.verifyAsync(bearerToken, verifyOptions);
      const { id } = payload;
      const user = await this.userRepository.findOne({ where: { id: id }, relations: ['roles'] });
      return user;
    } catch (error) {
      throw new HttpException('Access token is invalid. Please try with new Access token.', HttpStatus.UNAUTHORIZED);
    }
  }
}
