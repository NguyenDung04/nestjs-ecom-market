import { Controller, Get, Post, Render } from '@nestjs/common';
import { AuthViewService } from './auth-view.service';

@Controller('auth')
export class AuthViewController {
  constructor(private readonly authViewService: AuthViewService) {}

  @Get('login')
  @Render('auth/login')
  login() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng nhập',
      ...this.authViewService.login(),
    };
  }

  @Post('login')
  @Render('auth/login')
  submitLogin() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng nhập',
      error: 'Đây là form mẫu, chưa xử lý đăng nhập thật.',
    };
  }

  @Get('register')
  @Render('auth/register')
  register() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng ký',
      ...this.authViewService.register(),
    };
  }

  @Post('register')
  @Render('auth/register')
  submitRegister() {
    return {
      layout: 'layouts/auth',
      title: 'Đăng ký',
      success: 'Đăng ký mẫu thành công.',
    };
  }

  @Get('forgot-password')
  @Render('auth/forgot-password')
  forgotPassword() {
    return {
      layout: 'layouts/auth',
      title: 'Quên mật khẩu',
      ...this.authViewService.forgotPassword(),
    };
  }

  @Post('forgot-password')
  @Render('auth/forgot-password')
  submitForgotPassword() {
    return {
      layout: 'layouts/auth',
      title: 'Quên mật khẩu',
      success: 'Yêu cầu đặt lại mật khẩu đã được ghi nhận.',
    };
  }
}
