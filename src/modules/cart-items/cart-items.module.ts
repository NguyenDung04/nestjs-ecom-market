import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [TypeOrmModule, CartItemsService],
})
export class CartItemsModule {}
