import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Product } from '../products/entities/product.entity';
import { CategoryValidator } from 'src/common/validators/category.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryValidator],
  exports: [TypeOrmModule, CategoriesService],
})
export class CategoriesModule {}
