/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { AppModule } from './app/app.module';
//import { HttpExceptionFilter } from './app/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    })
  );
  //app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(globalPrefix);
  app.use(compression());
  app.use(helmet());
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
