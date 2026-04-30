import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AuthViewController {
  private readonly siteName = 'Ecom Market';

  @Get('login')
  @Render('auth/login')
  login() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng nhập',
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      authHeroTitle: 'Mua sắm thông minh hơn',
      authHeroHighlight: 'với tài khoản',
      description:
        'Đăng nhập để theo dõi đơn hàng, quản lý địa chỉ, nhận ưu đãi và tiếp tục trải nghiệm mua sắm cá nhân hóa.',
      message: 'Trang đăng nhập',
    };
  }

  @Get('register')
  @Render('auth/register')
  register() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng ký',
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      authHeroTitle: 'Tham gia Ecom Market',
      authHeroHighlight: 'ngay hôm nay',
      description:
        'Tạo tài khoản để theo dõi đơn hàng, lưu địa chỉ giao hàng, nhận ưu đãi riêng và đánh giá sản phẩm sau khi mua.',
      message: 'Trang đăng ký',
    };
  }

  @Get('forgot-password')
  @Render('auth/forgot-password')
  forgotPassword() {
    return {
      layout: 'layouts/auth',
      title: 'Quên mật khẩu',
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      authHeroTitle: 'Khôi phục tài khoản',
      authHeroHighlight: 'qua email',
      description:
        'Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu an toàn từ Ecom Market.',
      message: 'Trang quên mật khẩu',
    };
  }

  @Get('reset-password')
  @Render('auth/reset-password')
  resetPassword() {
    return {
      layout: 'layouts/auth',
      title: 'Đặt lại mật khẩu',
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      authHeroTitle: 'Tạo mật khẩu mới',
      authHeroHighlight: 'an toàn hơn',
      description:
        'Nhập mật khẩu mới và xác nhận mật khẩu để khôi phục quyền truy cập tài khoản của bạn.',
      message: 'Trang đặt lại mật khẩu',
    };
  }
}
