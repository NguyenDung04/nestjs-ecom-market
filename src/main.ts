/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  /*
   * =========================================================
   * 1. KHỞI TẠO ỨNG DỤNG NESTJS
   * =========================================================
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  /*
   * =========================================================
   * 2. CẤU HÌNH LOGGER
   * =========================================================
   */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const logger = new Logger('Bootstrap');

  /*
   * =========================================================
   * 3. ĐỌC CẤU HÌNH TỪ FILE .ENV
   * =========================================================
   */
  const configService = app.get(ConfigService);

  const appName = configService.get<string>('APP_NAME', 'nest-mvc');
  const appEnv = configService.get<string>('NODE_ENV', 'development');
  const appPort = Number(configService.get<number>('APP_PORT', 8080));
  const appHost = configService.get<string>('APP_HOST', '0.0.0.0');
  const appUrl = configService.get<string>(
    'APP_URL',
    `http://localhost:${appPort}`,
  );
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');

  /*
   * =========================================================
   * 4. ĐỌC CÁC CỜ BẬT/TẮT TÍNH NĂNG
   * =========================================================
   */
  const enableSwagger =
    configService.get<string>('ENABLE_SWAGGER', 'true') === 'true';
  const enableHelmet =
    configService.get<string>('ENABLE_HELMET', 'true') === 'true';
  const enableCors =
    configService.get<string>('ENABLE_CORS', 'true') === 'true';

  /*
   * =========================================================
   * 5. CẤU HÌNH DANH SÁCH CORS ORIGIN
   * =========================================================
   */
  const corsOrigins = configService
    .get<string>('CORS_ORIGIN', 'http://localhost:8080,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim());

  /*
   * =========================================================
   * 6. TRUST PROXY
   * =========================================================
   */
  app.set('trust proxy', 1);

  /*
   * =========================================================
   * 7. COOKIE PARSER
   * =========================================================
   */
  app.use(
    cookieParser(
      configService.get<string>('COOKIE_SECRET', 'super-cookie-secret'),
    ),
  );

  /*
   * =========================================================
   * 8. HELMET - BẢO MẬT HTTP HEADER
   * =========================================================
   */
  if (enableHelmet) {
    app.use(
      helmet({
        contentSecurityPolicy: appEnv === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: false,
      }),
    );
    logger.log('Đã bật Helmet để tăng cường bảo mật HTTP header');
  } else {
    logger.warn('Helmet đang bị tắt theo cấu hình môi trường');
  }

  /*
   * =========================================================
   * 9. CORS - CHO PHÉP FRONTEND GỌI API
   * =========================================================
   */
  if (enableCors) {
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (corsOrigins.includes(origin)) return callback(null, true);

        return callback(
          new Error(`Nguồn yêu cầu ${origin} không được CORS cho phép`),
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

    logger.log(`Đã bật CORS cho các nguồn: ${corsOrigins.join(', ')}`);
  } else {
    logger.warn('CORS đang bị tắt theo cấu hình môi trường');
  }

  /*
   * =========================================================
   * 10. GLOBAL API PREFIX
   * =========================================================
   */
  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },

      {
        path: 'auth/login',
        method: RequestMethod.GET,
      },
      {
        path: 'auth/register',
        method: RequestMethod.GET,
      },
      {
        path: 'auth/forgot-password',
        method: RequestMethod.GET,
      },
      {
        path: 'auth/reset-password',
        method: RequestMethod.GET,
      },

      {
        path: 'admin',
        method: RequestMethod.GET,
      },
      {
        path: 'admin/(.*)',
        method: RequestMethod.GET,
      },

      {
        path: 'health',
        method: RequestMethod.GET,
      },
      {
        path: 'docs',
        method: RequestMethod.GET,
      },
      {
        path: 'docs-json',
        method: RequestMethod.GET,
      },
      {
        path: 'favicon.ico',
        method: RequestMethod.GET,
      },
    ],
  });

  /*
   * =========================================================
   * 11. GLOBAL VALIDATION PIPE
   * =========================================================
   */
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

  /*
   * =========================================================
   * 12. GLOBAL EXCEPTION FILTER
   * =========================================================
   */
  app.useGlobalFilters(new GlobalExceptionFilter());

  /*
   * =========================================================
   * 13. GLOBAL RESPONSE INTERCEPTOR
   * =========================================================
   */
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  /*
   * =========================================================
   * 14. STATIC ASSETS
   * =========================================================
   */
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });

  /*
   * =========================================================
   * 15. VIEW ENGINE HBS
   * =========================================================
   * Cấu hình thư mục views, layout, partial và helper cho HBS.
   */
  const viewsDir = join(process.cwd(), 'src', 'views');

  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  hbs.registerPartials(join(viewsDir, 'partials', 'shared'));
  hbs.registerPartials(join(viewsDir, 'partials', 'auth'));
  hbs.registerPartials(join(viewsDir, 'partials', 'client'));
  hbs.registerPartials(join(viewsDir, 'partials', 'admin'));

  hbs.registerHelper('eq', function (a: unknown, b: unknown) {
    return a === b;
  });

  hbs.registerHelper('or', function (a: unknown, b: unknown) {
    return a || b;
  });

  hbs.registerHelper('json', function (context: unknown) {
    return JSON.stringify(context);
  });

  /*
   * =========================================================
   * 16. CSRF TOKEN CHO VIEW
   * =========================================================
   */
  app.use((req: any, res: any, next: () => void) => {
    res.locals.csrfToken = '';
    next();
  });

  /*
   * =========================================================
   * 17. SWAGGER API DOCUMENTATION
   * =========================================================
   */
  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${appName} API`)
      .setDescription('Tài liệu API cho dự án NestJS MVC kết hợp REST API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`Tài liệu Swagger của ${appName} có tại ${appUrl}/docs`);
  } else {
    logger.warn('Swagger đang bị tắt theo cấu hình môi trường');
  }

  /*
   * =========================================================
   * 18. KHỞI CHẠY SERVER
   * =========================================================
   */
  await app.listen(appPort, appHost);

  /*
   * =========================================================
   * 19. LOG THÔNG TIN SAU KHI KHỞI ĐỘNG
   * =========================================================
   */
  logger.log(`${appName} đang chạy tại ${appUrl}`);
  logger.log(`Môi trường hiện tại: ${appEnv}`);
  logger.log(`Tiền tố API: /${apiPrefix}`);
  logger.log(`Views directory: ${viewsDir}`);
}

bootstrap();
