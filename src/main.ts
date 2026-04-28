/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import hbs = require('hbs');
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

/*
 * =========================================================
 * DANH SÁCH ROUTE WEB KHÔNG ĐƯỢC GẮN PREFIX /api
 * =========================================================
 */
const WEB_ROUTE_EXCLUDES = [
  {
    path: '/',
    method: RequestMethod.GET,
  },

  /*
   * Auth views
   */
  {
    path: 'auth/login',
    method: RequestMethod.GET,
  },
  {
    path: 'auth/login',
    method: RequestMethod.POST,
  },
  {
    path: 'auth/register',
    method: RequestMethod.GET,
  },
  {
    path: 'auth/register',
    method: RequestMethod.POST,
  },
  {
    path: 'auth/forgot-password',
    method: RequestMethod.GET,
  },
  {
    path: 'auth/forgot-password',
    method: RequestMethod.POST,
  },
  {
    path: 'auth/reset-password',
    method: RequestMethod.GET,
  },
  {
    path: 'auth/reset-password',
    method: RequestMethod.POST,
  },
  {
    path: 'auth/logout',
    method: RequestMethod.POST,
  },

  /*
   * Client views
   */
  {
    path: 'products',
    method: RequestMethod.GET,
  },
  {
    path: 'products/:slug',
    method: RequestMethod.GET,
  },
  {
    path: 'cart',
    method: RequestMethod.GET,
  },
  {
    path: 'cart/(.*)',
    method: RequestMethod.ALL,
  },
  {
    path: 'checkout',
    method: RequestMethod.GET,
  },
  {
    path: 'checkout',
    method: RequestMethod.POST,
  },
  {
    path: 'orders',
    method: RequestMethod.GET,
  },
  {
    path: 'orders/:id',
    method: RequestMethod.GET,
  },
  {
    path: 'profile',
    method: RequestMethod.GET,
  },
  {
    path: 'profile',
    method: RequestMethod.POST,
  },
  {
    path: 'contact',
    method: RequestMethod.GET,
  },
  {
    path: 'contact',
    method: RequestMethod.POST,
  },

  /*
   * Admin views
   */
  {
    path: 'admin',
    method: RequestMethod.GET,
  },
  {
    path: 'admin/(.*)',
    method: RequestMethod.ALL,
  },

  /*
   * Error views
   */
  {
    path: 'error/404',
    method: RequestMethod.GET,
  },
  {
    path: 'error/500',
    method: RequestMethod.GET,
  },

  /*
   * Static / system
   */
  {
    path: 'health',
    method: RequestMethod.GET,
  },
  {
    path: 'favicon.ico',
    method: RequestMethod.GET,
  },
];

/*
 * =========================================================
 * ĐỌC BOOLEAN TỪ ENV
 * =========================================================
 */
function getBooleanConfig(
  configService: ConfigService,
  key: string,
  defaultValue: boolean,
): boolean {
  const value = configService.get<string>(key);

  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return value === 'true';
}

/*
 * =========================================================
 * ĐỌC NUMBER TỪ ENV
 * =========================================================
 */
function getNumberConfig(
  configService: ConfigService,
  key: string,
  defaultValue: number,
): number {
  const value = Number(configService.get<string>(key));

  if (Number.isNaN(value)) {
    return defaultValue;
  }

  return value;
}

/*
 * =========================================================
 * REGISTER PARTIAL CÓ NAMESPACE
 * =========================================================
 * Ví dụ:
 * src/views/partials/client/header.hbs
 * → dùng trong view: {{> client/header}}
 *
 * src/views/partials/admin/sidebar.hbs
 * → dùng trong view: {{> admin/sidebar}}
 */
function registerNamespacedPartials(
  partialsRootDir: string,
  namespace: string,
  logger: Logger,
): void {
  const targetDir = join(partialsRootDir, namespace);

  if (!existsSync(targetDir)) {
    logger.warn(`Không tìm thấy partial directory: ${targetDir}`);
    return;
  }

  const files = readdirSync(targetDir).filter(
    (file) => extname(file) === '.hbs',
  );

  for (const file of files) {
    const partialName = `${namespace}/${basename(file, '.hbs')}`;
    const partialPath = join(targetDir, file);
    const partialContent = readFileSync(partialPath, 'utf8');

    hbs.registerPartial(partialName, partialContent);
  }

  logger.log(`Đã register partial namespace: ${namespace}`);
}

/*
 * =========================================================
 * CẤU HÌNH HBS VIEW ENGINE
 * =========================================================
 */
function setupViewEngine(app: NestExpressApplication, logger: Logger): void {
  // dist/views
  // Khi chạy Nest, __dirname thường là dist.
  // Vì vậy dùng join(__dirname, 'views') là đúng nhất.

  const viewsDir = join(__dirname, 'views');
  const publicDir = join(process.cwd(), 'public');
  const partialsDir = join(viewsDir, 'partials');

  /*
   * Static assets:
   * /css/output.css
   * /js/app.js
   * /images/logo.png
   */
  app.useStaticAssets(publicDir);

  /*
   * Cấu hình thư mục views.
   */
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  /*
   * Register partials thường.
   * Dùng được nếu partial nằm trực tiếp trong:
   * src/views/partials/header.hbs
   * → {{> header}}
   */
  if (existsSync(partialsDir)) {
    hbs.registerPartials(partialsDir);
  }

  /*
   * Register partials có namespace.
   * Dùng được:
   * {{> client/header}}
   * {{> client/footer}}
   * {{> admin/sidebar}}
   * {{> admin/header}}
   * {{> common/alert}}
   */
  registerNamespacedPartials(partialsDir, 'client', logger);
  registerNamespacedPartials(partialsDir, 'admin', logger);
  registerNamespacedPartials(partialsDir, 'auth', logger);
  registerNamespacedPartials(partialsDir, 'common', logger);

  /*
   * Helper so sánh bằng.
   */
  hbs.registerHelper('eq', function (a: unknown, b: unknown) {
    return a === b;
  });

  /*
   * Helper OR.
   */
  hbs.registerHelper('or', function (a: unknown, b: unknown) {
    return Boolean(a || b);
  });

  /*
   * Helper AND.
   */
  hbs.registerHelper('and', function (a: unknown, b: unknown) {
    return Boolean(a && b);
  });

  /*
   * Helper tăng index.
   */
  hbs.registerHelper('inc', function (value: unknown) {
    return Number(value || 0) + 1;
  });

  /*
   * Helper chuyển object sang JSON.
   */
  hbs.registerHelper('json', function (context: unknown) {
    return JSON.stringify(context);
  });

  /*
   * Helper format tiền Việt Nam.
   */
  hbs.registerHelper('formatCurrency', function (value: unknown) {
    const numberValue = Number(value || 0);

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(numberValue);
  });

  /*
   * Helper format ngày.
   */
  hbs.registerHelper('formatDate', function (value: unknown) {
    if (!value) {
      return '';
    }

    const date = new Date(value as string);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  });

  /*
   * Helper trạng thái đơn hàng.
   */
  hbs.registerHelper('orderStatusLabel', function (status: string) {
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      preparing: 'Đang chuẩn bị',
      shipping: 'Đang giao hàng',
      completed: 'Hoàn tất',
      cancelled: 'Đã hủy',
      returned: 'Hoàn trả',
    };

    return labels[status] || status;
  });

  /*
   * Helper trạng thái thanh toán.
   */
  hbs.registerHelper('paymentStatusLabel', function (status: string) {
    const labels: Record<string, string> = {
      unpaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền',
    };

    return labels[status] || status;
  });

  logger.log(`Public directory: ${publicDir}`);
  logger.log(`Views directory: ${viewsDir}`);
}

/*
 * =========================================================
 * CẤU HÌNH SWAGGER
 * =========================================================
 */
function setupSwagger(
  app: NestExpressApplication,
  appName: string,
  appUrl: string,
  logger: Logger,
): void {
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

  logger.log(`Swagger docs: ${appUrl}/docs`);
}

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
   * 2. LOGGER
   * =========================================================
   */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const logger = new Logger('Bootstrap');

  /*
   * =========================================================
   * 3. ĐỌC CẤU HÌNH ENV
   * =========================================================
   */
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

  /*
   * =========================================================
   * 4. TRUST PROXY
   * =========================================================
   */
  app.set('trust proxy', 1);

  /*
   * =========================================================
   * 5. COOKIE PARSER
   * =========================================================
   */
  app.use(
    cookieParser(
      configService.get<string>('COOKIE_SECRET', 'super-cookie-secret'),
    ),
  );

  /*
   * =========================================================
   * 6. COMPRESSION
   * =========================================================
   */
  if (enableCompression) {
    app.use(compression());
    logger.log('Đã bật compression');
  }

  /*
   * =========================================================
   * 7. HELMET
   * =========================================================
   */
  if (enableHelmet) {
    app.use(
      helmet({
        contentSecurityPolicy: appEnv === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: false,
      }),
    );

    logger.log('Đã bật Helmet');
  } else {
    logger.warn('Helmet đang bị tắt');
  }

  /*
   * =========================================================
   * 8. CORS
   * =========================================================
   */
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

    logger.log(`Đã bật CORS: ${corsOrigins.join(', ')}`);
  } else {
    logger.warn('CORS đang bị tắt');
  }

  /*
   * =========================================================
   * 9. GLOBAL API PREFIX
   * =========================================================
   */
  if (enableApiPrefix) {
    app.setGlobalPrefix(apiPrefix, {
      exclude: WEB_ROUTE_EXCLUDES,
    });

    logger.log(`Đã bật API prefix: /${apiPrefix}`);
  } else {
    logger.warn('API prefix đang bị tắt');
  }

  /*
   * =========================================================
   * 10. GLOBAL VALIDATION PIPE
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
   * 11. GLOBAL EXCEPTION FILTER
   * =========================================================
   */
  app.useGlobalFilters(new GlobalExceptionFilter());

  /*
   * =========================================================
   * 12. GLOBAL RESPONSE INTERCEPTOR
   * =========================================================
   *
   * Lưu ý:
   * Nếu view bị mất layout/title/data, hãy sửa TransformResponseInterceptor
   * để bỏ qua request HTML.
   */
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  /*
   * =========================================================
   * 13. STATIC ASSETS + HBS VIEW ENGINE
   * =========================================================
   */
  setupViewEngine(app, logger);

  /*
   * =========================================================
   * 14. CSRF TOKEN TẠM THỜI CHO VIEW
   * =========================================================
   */
  app.use((req: any, res: any, next: () => void) => {
    res.locals.csrfToken = '';
    next();
  });

  /*
   * =========================================================
   * 15. SWAGGER
   * =========================================================
   */
  if (enableSwagger) {
    setupSwagger(app, appName, appUrl, logger);
  } else {
    logger.warn('Swagger đang bị tắt');
  }

  /*
   * =========================================================
   * 16. KHỞI CHẠY SERVER
   * =========================================================
   */
  await app.listen(appPort, appHost);

  /*
   * =========================================================
   * 17. LOG SAU KHI KHỞI ĐỘNG
   * =========================================================
   */
  logger.log(`${appName} đang chạy tại ${appUrl}`);
  logger.log(`Môi trường: ${appEnv}`);
  logger.log(`Host: ${appHost}`);
  logger.log(`Port: ${appPort}`);
  logger.log(`Swagger: ${enableSwagger ? `${appUrl}/docs` : 'disabled'}`);
}

bootstrap();
