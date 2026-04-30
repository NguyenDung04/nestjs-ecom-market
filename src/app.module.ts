import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import databaseConfig from './config/database.config';
import { winstonConfig } from './common/logger/winston.config';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

import { WebModule } from './web/web.module';

import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CartsModule } from './modules/carts/carts.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { BannersModule } from './modules/banners/banners.module';
import { SettingsModule } from './modules/settings/settings.module';
import { InventoryLogsModule } from './modules/inventory-logs/inventory-logs.module';
import { AuthModule } from './modules/auth/auth.module';

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

        autoLoadEntities: true,

        synchronize: false,
        logging: configService.get<boolean>('database.logging'),
      }),
    }),

    WebModule,

    RolesModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    AddressesModule,
    CartsModule,
    CartItemsModule,
    CouponsModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    ContactsModule,
    BannersModule,
    SettingsModule,
    InventoryLogsModule,
    AuthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
