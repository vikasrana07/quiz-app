import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { QuestionsModule } from './questions/questions.module';

import { UsersEntity } from './users/users.entity';
import { CategoriesEntity } from './categories/categories.entity';
import { QuestionsEntity } from './questions/questions.entity';
import { AppMiddleware } from './common/middlewares/app.middleware';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

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
        UsersEntity
      ],
      // entities: ['../typeorm/entities/*.ts'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UsersEntity]),
    AuthModule,
    CategoriesModule,
    QuestionsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, JwtService],
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
