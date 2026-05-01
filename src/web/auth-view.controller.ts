import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthViewController {
  private readonly siteName = 'Ecom Market';

  constructor(private readonly configService: ConfigService) {}

  private getViewData(title: string, extra: Record<string, unknown> = {}) {
    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:8080';

    const appUrlApi =
      this.configService.get<string>('APP_URL_API') || `${appUrl}/api`;

    return {
      layout: 'layouts/auth',
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
   * Render trang đăng nhập.
   */
  @Get('login')
  @Render('auth/login')
  login() {
    return this.getViewData('Đăng nhập', {
      authHeroTitle: 'Mua sắm thông minh hơn',
      authHeroHighlight: 'với tài khoản',
      description:
        'Đăng nhập để theo dõi đơn hàng, quản lý địa chỉ, nhận ưu đãi và tiếp tục trải nghiệm mua sắm cá nhân hóa.',
      message: 'Trang đăng nhập',
    });
  }

  /**
   * Render trang đăng ký tài khoản.
   */
  @Get('register')
  @Render('auth/register')
  register() {
    return this.getViewData('Đăng ký', {
      authHeroTitle: 'Tham gia Ecom Market',
      authHeroHighlight: 'ngay hôm nay',
      description:
        'Tạo tài khoản để theo dõi đơn hàng, lưu địa chỉ giao hàng, nhận ưu đãi riêng và đánh giá sản phẩm sau khi mua.',
      message: 'Trang đăng ký',
    });
  }

  /**
   * Render trang quên mật khẩu.
   */
  @Get('forgot-password')
  @Render('auth/forgot-password')
  forgotPassword() {
    return this.getViewData('Quên mật khẩu', {
      authHeroTitle: 'Khôi phục tài khoản',
      authHeroHighlight: 'qua email',
      description:
        'Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu an toàn từ Ecom Market.',
      message: 'Trang quên mật khẩu',
    });
  }

  /**
   * Render trang đặt lại mật khẩu.
   */
  @Get('reset-password')
  @Render('auth/reset-password')
  resetPassword() {
    return this.getViewData('Đặt lại mật khẩu', {
      authHeroTitle: 'Tạo mật khẩu mới',
      authHeroHighlight: 'an toàn hơn',
      description:
        'Nhập mật khẩu mới và xác nhận mật khẩu để khôi phục quyền truy cập tài khoản của bạn.',
      message: 'Trang đặt lại mật khẩu',
    });
  }
}
