import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppMiddleware } from './common/middlewares/app.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { QuestionsModule } from './questions/questions.module';

import { SettingsModule } from './settings/settings.module';
import { UsersEntity } from './users/users.entity';
import { CategoriesEntity } from './categories/categories.entity';
import { QuestionsEntity } from './questions/questions.entity';
import { SettingsEntity } from './settings/settings.entity';
import { UsersService } from './users/users.service';
import { UtilService } from './common/services';

const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    CategoriesEntity,
    QuestionsEntity,
    UsersEntity,
    SettingsEntity
  ],
  synchronize: true,
}
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 604800
      },
      exclude: ['/api*']
    }),
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([UsersEntity]),
    ConfigModule.forRoot(),
    AuthModule,
    CategoriesModule,
    QuestionsModule,
    UsersModule,
    SettingsModule
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, JwtService, UtilService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .exclude(
        { path: 'api/auth/login', method: RequestMethod.POST }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
