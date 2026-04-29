/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

import { getBooleanConfig, getNumberConfig } from './bootstrap/app-config.util';
import { WEB_ROUTE_EXCLUDES } from './bootstrap/web-routes.exclude';
import { setupViewEngine } from './bootstrap/hbs.config';
import { setupSwagger } from './bootstrap/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const appName = configService.get<string>('APP_NAME', 'nestjs-ecom-market');
  const appEnv = configService.get<string>('NODE_ENV', 'development');
  const appPort = getNumberConfig(configService, 'APP_PORT', 8080);
  const appHost = configService.get<string>('APP_HOST', '0.0.0.0');
  const appUrl = configService.get<string>(
    'APP_URL',
    `http://localhost:${appPort}`,
  );

  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const enableApiPrefix = getBooleanConfig(
    configService,
    'ENABLE_API_PREFIX',
    true,
  );
  const enableSwagger = getBooleanConfig(configService, 'ENABLE_SWAGGER', true);
  const enableHelmet = getBooleanConfig(configService, 'ENABLE_HELMET', true);
  const enableCors = getBooleanConfig(configService, 'ENABLE_CORS', true);
  const enableCompression = getBooleanConfig(
    configService,
    'ENABLE_COMPRESSION',
    true,
  );

  app.set('trust proxy', 1);

  app.use(
    cookieParser(
      configService.get<string>('COOKIE_SECRET', 'super-cookie-secret'),
    ),
  );

  if (enableCompression) {
    app.use(compression());
  }

  if (enableHelmet) {
    app.use(
      helmet({
        contentSecurityPolicy: appEnv === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: false,
      }),
    );
  }

  if (enableCors) {
    const corsOrigins = configService
      .get<string>(
        'CORS_ORIGIN',
        'http://localhost:8080,http://localhost:3000,http://localhost:3001',
      )
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (corsOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(
          new Error(`Origin ${origin} không được CORS cho phép`),
          false,
        );
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'X-Request-Id',
      ],
      exposedHeaders: ['set-cookie', 'X-Request-Id'],
    });
  }

  if (enableApiPrefix) {
    app.setGlobalPrefix(apiPrefix, {
      exclude: WEB_ROUTE_EXCLUDES,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.use((req: any, res: any, next: () => void) => {
    res.locals.csrfToken = '';
    next();
  });

  setupViewEngine(app, logger);

  if (enableSwagger) {
    setupSwagger(app, appName, appUrl, logger);
  }

  await app.listen(appPort, appHost);

  logger.log(`${appName} đang chạy tại ${appUrl}`);
  logger.log(`Môi trường: ${appEnv}`);
  logger.log(`Swagger: ${enableSwagger ? `${appUrl}/docs` : 'disabled'}`);
}

bootstrap();
