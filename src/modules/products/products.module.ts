import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductValidator } from 'src/common/validators/product.validator';
import { Category } from '../categories/entities/category.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderItem, Review])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductValidator],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
