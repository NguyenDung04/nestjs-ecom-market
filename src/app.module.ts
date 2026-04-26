import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import databaseConfig from './config/database.config';
import { winstonConfig } from './common/logger/winston.config';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

// import { AppController } from './app.controller';

import { User } from './modules/users/entities/user.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Product } from './modules/products/entities/product.entity';

import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

import { WebModule } from './web/web.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [databaseConfig],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    WinstonModule.forRoot(winstonConfig),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(configService.get('THROTTLE_TTL', 60)) * 1000,
            limit: Number(configService.get('THROTTLE_LIMIT', 20)),
          },
        ],
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [User, Category, Product],
        synchronize: false,
        logging: configService.get<boolean>('database.logging'),
        autoLoadEntities: false,
      }),
    }),

    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    WebModule,
  ],
  // controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
