import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { QuestionsModule } from './questions/questions.module';

import { SettingsModule } from './settings/settings.module';
/* import { UsersEntity } from './users/users.entity';
import { CategoriesEntity } from './categories/categories.entity';
import { QuestionsEntity } from './questions/questions.entity';
import { SettingsEntity } from './settings/settings.entity'; */

import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Category } from './categories/entities/category.entity';
import { Quiz } from './quizzes/entities/quiz.entity';
import { Question } from './questions/entities/question.entity';
import { QuestionType } from './questions/entities/question-type.entity';

import { Dashboard } from './dashboard/entities/dashboard.entity';
import { Widget } from './widgets/entities/widget.entity';

import { Setting } from './settings/entities/setting.entity';

import { UsersService } from './users/users.service';
import { UtilService } from './common/services';
import { DashboardsModule } from './dashboard/dashboards.module';
import { WidgetsModule } from './widgets/widgets.module';
import { QuizzesModule } from './quizzes/quizzes.module';

const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  timezone: 'Z',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    Category,
    Quiz,
    Question,
    QuestionType,
    User,
    Dashboard,
    Widget,
    Setting,
  ],
  //entities: ['../**/*.entity.{ts,js}'],
  autoLoadEntities: true,
  synchronize: true,
};
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveStaticOptions: {
        cacheControl: true,
        maxAge: 604800,
      },
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule.forRoot(),
    AuthModule,
    CategoriesModule,
    QuestionsModule,
    QuizzesModule,
    UsersModule,
    RolesModule,
    DashboardsModule,
    WidgetsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, JwtService, UtilService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .exclude(
        { path: 'api/auth/generatetoken', method: RequestMethod.POST },
        { path: 'api/auth/validateToken', method: RequestMethod.GET }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
