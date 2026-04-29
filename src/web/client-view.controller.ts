import { Controller, Get, Post, Render } from '@nestjs/common';

@Controller()
export class ClientViewController {
  @Get()
  @Render('client/home/index')
  home() {
    return {
      layout: 'layouts/client',
      title: 'Trang chủ',
      message: 'Chào mừng đến với Ecom Market',
    };
  }

  @Get('products')
  @Render('client/products/list')
  products() {
    return {
      layout: 'layouts/client',
      title: 'Sản phẩm',
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
