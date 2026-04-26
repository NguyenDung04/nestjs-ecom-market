import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Product } from '../modules/products/entities/product.entity';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

dotenv.config();

const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nest_mvc_dev',
  entities: [User, Category, Product],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true' || isDevelopment,
});
