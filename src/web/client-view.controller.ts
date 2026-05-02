import { Controller, Get, Post, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Controller render các trang giao diện Client.
 *
 * Công dụng:
 * - Render các trang phía người dùng như trang chủ, sản phẩm, giỏ hàng,
 *   thanh toán, lịch sử đơn hàng và liên hệ.
 * - Dùng layout chung layouts/client.
 * - Dùng getViewData() để truyền dữ liệu chung cho toàn bộ giao diện client.
 * - Controller này chỉ phụ trách hiển thị trang.
 *   Dữ liệu động nên được lấy qua API riêng bằng JavaScript/fetch.
 */
@Controller()
export class ClientViewController {
  private readonly siteName = 'Ecom Market';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Tạo dữ liệu dùng chung cho tất cả trang client.
   *
   * Công dụng:
   * - Tránh lặp lại layout, siteName, appUrl, appUrlApi ở từng route.
   * - Truyền currentYear cho footer.
   * - Cho phép mỗi trang truyền thêm dữ liệu riêng qua biến extra.
   */
  private getViewData(title: string, extra: Record<string, unknown> = {}) {
    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:8080';

    const appUrlApi =
      this.configService.get<string>('APP_URL_API') || `${appUrl}/api`;

    return {
      layout: 'layouts/client',
      title,
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      appUrl,
      appUrlApi,
      currentYear: new Date().getFullYear(),

      ...extra,
    };
  }

  /**
   * Render trang chủ client.
   */
  @Get()
  @Render('client/home/index')
  home() {
    return this.getViewData('Trang chủ', {
      message: 'Chào mừng đến với Ecom Market',
    });
  }

  /**
   * Render trang danh sách sản phẩm.
   */
  @Get('san-pham')
  @Render('client/products/list')
  products() {
    return this.getViewData('Sản phẩm');
  }

  /**
   * Render trang giỏ hàng.
   */
  @Get('cart')
  @Render('client/cart/index')
  cart() {
    return this.getViewData('Giỏ hàng', {
      cartItems: [],
    });
  }

  /**
   * Render trang thanh toán.
   */
  @Get('checkout')
  @Render('client/checkout/index')
  checkout() {
    return this.getViewData('Thanh toán');
  }

  /**
   * Render trang lịch sử đơn hàng.
   */
  @Get('orders')
  @Render('client/orders/history')
  orderHistory() {
    return this.getViewData('Lịch sử đơn hàng');
  }

  /**
   * Render trang liên hệ.
   */
  @Get('contact')
  @Render('client/contact/index')
  contact() {
    return this.getViewData('Liên hệ');
  }

  @Post('contact')
  @Render('client/contact/index')
  submitContact() {
    return this.getViewData('Liên hệ', {
      success: 'Gửi liên hệ thành công.',
    });
  }
}
