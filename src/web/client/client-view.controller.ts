import { Controller, Get, Param, Post, Render } from '@nestjs/common';
import { ClientViewService } from './client-view.service';

@Controller()
export class ClientViewController {
  constructor(private readonly clientViewService: ClientViewService) {}

  @Get()
  @Render('client/home/index')
  home() {
    return {
      layout: 'layouts/client',
      title: 'Trang chủ',
      ...this.clientViewService.getHomeData(),
    };
  }

  @Get('products')
  @Render('client/products/list')
  products() {
    return {
      layout: 'layouts/client',
      title: 'Sản phẩm',
      products: this.clientViewService.getProducts(),
    };
  }

  @Get('products/:slug')
  @Render('client/products/detail')
  productDetail(@Param('slug') slug: string) {
    const product = this.clientViewService.getProductBySlug(slug);

    return {
      layout: 'layouts/client',
      title: product?.name || 'Chi tiết sản phẩm',
      product,
    };
  }

  @Get('cart')
  @Render('client/cart/index')
  cart() {
    return {
      layout: 'layouts/client',
      title: 'Giỏ hàng',
      cartItems: [],
    };
  }

  @Get('checkout')
  @Render('client/checkout/index')
  checkout() {
    return {
      layout: 'layouts/client',
      title: 'Thanh toán',
    };
  }

  @Get('orders')
  @Render('client/orders/history')
  orderHistory() {
    return {
      layout: 'layouts/client',
      title: 'Lịch sử đơn hàng',
      orders: this.clientViewService.getOrders(),
    };
  }

  @Get('orders/:id')
  @Render('client/orders/detail')
  orderDetail(@Param('id') id: string) {
    const order = this.clientViewService.getOrderById(Number(id));

    return {
      layout: 'layouts/client',
      title: 'Chi tiết đơn hàng',
      order,
    };
  }

  @Get('contact')
  @Render('client/contact/index')
  contact() {
    return {
      layout: 'layouts/client',
      title: 'Liên hệ',
    };
  }

  @Post('contact')
  @Render('client/contact/index')
  submitContact() {
    return {
      layout: 'layouts/client',
      title: 'Liên hệ',
      success: 'Gửi liên hệ thành công.',
    };
  }
}
