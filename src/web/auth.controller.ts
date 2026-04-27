import { Controller, Get, Render } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller()
export class WebAuthController {
  @Get('login')
  @Render('auth/login')
  loginPage() {
    return {
      title: 'Đăng nhập',
      layout: 'layouts/auth',
    };
  }

  @Get('register')
  @Render('auth/register')
  registerPage() {
    return {
      title: 'Đăng ký',
      layout: 'layouts/auth',
    };
  }

  @Get('forgot-password')
  @Render('auth/forgot-password')
  forgotPasswordPage() {
    return {
      title: 'Quên mật khẩu',
      layout: 'layouts/auth',
    };
  }
}
