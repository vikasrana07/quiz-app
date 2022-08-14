import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'quiz_app',
      entities: [
        CategoriesEntity,
        QuestionsEntity,
        UsersEntity,
        SettingsEntity
      ],
      // entities: ['../typeorm/entities/*.ts'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UsersEntity]),
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
