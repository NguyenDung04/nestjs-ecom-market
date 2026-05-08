/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { WebAuthGuard } from './guards/web-auth.guard';
import type { WebAuthRequest } from './guards/web-auth.guard';
import { JwtService } from '@nestjs/jwt';

@SkipThrottle({ default: true })
@Controller()
export class ClientViewController {
  private readonly siteName = 'Ecom Market';

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private async getOptionalAuthUser(request: WebAuthRequest) {
    if (request.user) {
      return request.user;
    }

    const accessToken = request.cookies?.access_token;

    if (!accessToken) {
      return null;
    }

    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'default_access_secret_change_me';

    try {
      return await this.jwtService.verifyAsync<{
        sub: number;
        email: string;
        role: string;
      }>(accessToken, {
        secret: accessSecret,
      });
    } catch {
      return null;
    }
  }

  private async getViewData(
    request: WebAuthRequest,
    title: string,
    extra: Record<string, unknown> = {},
  ) {
    const authUser = await this.getOptionalAuthUser(request);
    const authRole = authUser?.role || null;
    const authName = authUser?.email || 'Khách hàng';

    const authAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      authName,
    )}&background=0d9488&color=fff`;

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

      authUser,
      authRole,
      authName,
      authAvatar,

      isLoggedIn: !!authUser,
      isAdmin: authRole === 'admin',
      isStaff: authRole === 'staff',
      isMember: authRole === 'member',

      ...extra,
    };
  }

  /**
   * Render trang chủ client.
   */
  @Get()
  @Render('client/home/index')
  async home(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Trang chủ', {
      message: 'Chào mừng đến với Ecom Market',
    });
  }

  /**
   * Render trang danh sách sản phẩm.
   */
  @Get('products')
  @Render('client/products/index')
  products(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Sản phẩm');
  }

  /**
   * Alias tiếng Việt cho trang sản phẩm.
   */
  @Get('san-pham')
  @Render('client/products/index')
  productsAlias(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Sản phẩm');
  }

  /**
   * Render trang chi tiết sản phẩm.
   */
  @Get('products/:slug')
  @Render('client/products/detail')
  productDetail(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Chi tiết sản phẩm');
  }

  /**
   * Render trang khuyến mãi.
   */
  @Get('promotions')
  @Render('client/promotions/index')
  promotions(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Khuyến mãi');
  }

  /**
   * Render trang giỏ hàng.
   */
  @Get('cart')
  @Render('client/cart/index')
  cart(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Giỏ hàng', {
      cartItems: [],
    });
  }

  /**
   * Render trang thanh toán.
   * Route này cần đăng nhập.
   */
  @Get('checkout')
  @UseGuards(WebAuthGuard)
  @Render('client/checkout/index')
  checkout(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thanh toán');
  }

  /**
   * Render trang đặt hàng thành công.
   * Route này cần đăng nhập.
   */
  @Get('checkout/success')
  @UseGuards(WebAuthGuard)
  @Render('client/checkout/success')
  checkoutSuccess(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Đặt hàng thành công');
  }

  /**
   * Render trang thông tin cá nhân.
   */
  @Get('account/profile')
  @UseGuards(WebAuthGuard)
  @Render('client/account/profile')
  profile(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thông tin cá nhân');
  }

  /**
   * Render trang địa chỉ giao hàng.
   */
  @Get('account/addresses')
  @UseGuards(WebAuthGuard)
  @Render('client/account/addresses')
  addresses(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Địa chỉ giao hàng');
  }

  /**
   * Render trang đơn hàng của tôi.
   */
  @Get('account/orders')
  @UseGuards(WebAuthGuard)
  @Render('client/account/orders')
  orderHistory(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Đơn hàng của tôi');
  }

  /**
   * Alias cũ cho lịch sử đơn hàng.
   */
  @Get('orders')
  @UseGuards(WebAuthGuard)
  @Render('client/account/orders')
  orderHistoryAlias(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Đơn hàng của tôi');
  }

  /**
   * Render trang chi tiết đơn hàng.
   */
  @Get('account/orders/:id')
  @UseGuards(WebAuthGuard)
  @Render('client/account/order-detail')
  orderDetail(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Chi tiết đơn hàng');
  }

  /**
   * Render trang yêu thích.
   */
  @Get('account/wishlist')
  @UseGuards(WebAuthGuard)
  @Render('client/account/wishlist')
  wishlist(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Yêu thích');
  }

  /**
   * Render trang thông báo.
   */
  @Get('account/notifications')
  @UseGuards(WebAuthGuard)
  @Render('client/account/notifications')
  notifications(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thông báo');
  }

  /**
   * Render trang liên hệ / hỗ trợ.
   */
  @Get('contact')
  @Render('client/contact/index')
  contact(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Hỗ trợ');
  }

  /**
   * Alias cho trang hỗ trợ.
   */
  @Get('support')
  @Render('client/contact/index')
  support(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Hỗ trợ');
  }

  /**
   * Submit form liên hệ.
   */
  @Post('contact')
  @Render('client/contact/index')
  submitContact(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Hỗ trợ', {
      success: 'Gửi liên hệ thành công.',
    });
  }
}
