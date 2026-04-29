import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AuthViewController {
  siteName = 'Ecom Market';

  @Get('login')
  @Render('auth/login')
  login() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng nhập',
      siteName: 'Ecom Market',
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
      siteName: 'Ecom Market',
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
      siteName: 'Ecom Market',
      siteShortName: this.siteName.split(' ')[0],
      authHeroTitle: 'Khôi phục tài khoản',
      authHeroHighlight: 'an toàn và nhanh chóng',
      description:
        'Làm theo các bước xác minh email, nhận mã OTP và đặt lại mật khẩu để bảo vệ tài khoản của bạn.',
      message: 'Trang quên mật khẩu',
    };
  }
}
