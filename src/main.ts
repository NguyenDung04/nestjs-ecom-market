/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { join } from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import hbs from 'hbs';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

/*
 * =========================================================
 * DANH SÁCH ROUTE WEB KHÔNG ĐƯỢC GẮN PREFIX /api
 * =========================================================
 * Các route này là route render HBS, không phải REST API.
 * Nếu không exclude, khi setGlobalPrefix('api') thì:
 * /products sẽ thành /api/products
 * /login sẽ thành /api/login
 */
const WEB_ROUTE_EXCLUDES = [
  {
    path: '/',
    method: RequestMethod.GET,
  },

  {
    path: 'login',
    method: RequestMethod.GET,
  },
  {
    path: 'register',
    method: RequestMethod.GET,
  },
  {
    path: 'forgot-password',
    method: RequestMethod.GET,
  },
  {
    path: 'reset-password',
    method: RequestMethod.GET,
  },

  {
    path: 'products',
    method: RequestMethod.GET,
  },
  {
    path: 'products/:id',
    method: RequestMethod.GET,
  },
  {
    path: 'profile',
    method: RequestMethod.GET,
  },
  {
    path: 'cart',
    method: RequestMethod.GET,
  },
  {
    path: 'checkout',
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
    path: 'errors/404',
    method: RequestMethod.GET,
  },
  {
    path: 'errors/500',
    method: RequestMethod.GET,
  },

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
 * Cho phép dùng:
 * ENABLE_SWAGGER=true
 * ENABLE_SWAGGER=false
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
 * CẤU HÌNH HBS VIEW ENGINE
 * =========================================================
 */
function setupViewEngine(app: NestExpressApplication, logger: Logger): void {
  const viewsDir = join(process.cwd(), 'src', 'views');
  const publicDir = join(process.cwd(), 'public');

  /*
   * Static assets.
   *
   * Cách này cho phép gọi file tĩnh trực tiếp:
   * /css/output.css
   * /js/app.js
   * /images/logo.png
   *
   * Nếu bạn dùng prefix: '/public/' thì trong HBS phải gọi:
   * /public/css/output.css
   */
  app.useStaticAssets(publicDir);

  /*
   * Cấu hình thư mục view chính.
   */
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  /*
   * Đăng ký partial.
   *
   * Nếu bạn để partial trực tiếp:
   * src/views/partials/head.hbs
   *
   * Thì dùng được:
   * {{> head}}
   */
  hbs.registerPartials(join(viewsDir, 'partials'));

  /*
   * Nếu bạn chia partial theo thư mục con:
   * src/views/partials/shared/head.hbs
   * src/views/partials/client/client-header.hbs
   * src/views/partials/admin/admin-sidebar.hbs
   *
   * Thì các dòng dưới sẽ giúp HBS nhận thêm.
   */
  hbs.registerPartials(join(viewsDir, 'partials', 'shared'));
  hbs.registerPartials(join(viewsDir, 'partials', 'auth'));
  hbs.registerPartials(join(viewsDir, 'partials', 'client'));
  hbs.registerPartials(join(viewsDir, 'partials', 'admin'));

  /*
   * Helper so sánh bằng.
   * Dùng trong HBS:
   * {{#if (eq status "active")}} ... {{/if}}
   */
  hbs.registerHelper('eq', function (a: unknown, b: unknown) {
    return a === b;
  });

  /*
   * Helper OR.
   * Dùng trong HBS:
   * {{#if (or user admin)}} ... {{/if}}
   */
  hbs.registerHelper('or', function (a: unknown, b: unknown) {
    return a || b;
  });

  /*
   * Helper chuyển object sang JSON.
   * Dùng khi cần đẩy data từ server sang JS phía client:
   * const product = {{{json product}}};
   */
  hbs.registerHelper('json', function (context: unknown) {
    return JSON.stringify(context);
  });

  /*
   * Helper format tiền Việt Nam.
   * Dùng:
   * {{formatCurrency price}}
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
   * Dùng:
   * {{formatDate createdAt}}
   */
  hbs.registerHelper('formatDate', function (value: unknown) {
    if (!value) return '';

    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value as string));
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
   * Cần thiết khi deploy sau Nginx, Proxy, Load Balancer.
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
   * Nén response HTML, CSS, JS, JSON.
   */
  if (enableCompression) {
    app.use(compression());
    logger.log('Đã bật compression');
  }

  /*
   * =========================================================
   * 7. HELMET
   * =========================================================
   * Ở development tắt CSP để tránh lỗi CDN Tailwind, Flowbite,
   * Font Awesome, SweetAlert2.
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
        /*
         * Cho phép request không có origin:
         * Postman, mobile app, server-to-server.
         */
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
   * Chỉ API mới nên đi qua /api.
   * Route web render HBS được exclude.
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
   * Nếu TransformResponseInterceptor đang wrap cả dữ liệu render HBS,
   * ví dụ biến { title, layout } bị đổi thành { success, data },
   * thì view sẽ không nhận được title/layout.
   *
   * Khi đó cần sửa interceptor để bỏ qua request HTML.
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
   * Hiện tại chỉ set rỗng để form không lỗi.
   * Sau này khi bật csrf-csrf thì thay bằng token thật.
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
