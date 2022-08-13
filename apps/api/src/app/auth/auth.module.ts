import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from '../common/constants';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '14400s' }
    })],
  providers: [AuthService, UsersService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }