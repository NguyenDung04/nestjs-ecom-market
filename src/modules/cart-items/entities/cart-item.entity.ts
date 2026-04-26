import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
@Index('UQ_CART_ITEMS_CART_PRODUCT', ['cartId', 'productId'], { unique: true })
export class CartItem extends BaseEntity {
  @Column({ name: 'cart_id', type: 'int' })
  cartId!: number;

  @Column({ name: 'product_id', type: 'int' })
  productId!: number;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price!: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
