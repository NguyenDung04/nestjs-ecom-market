import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthViewService {
  login() {
    return {
      message: 'Trang đăng nhập',
    };
  }

  register() {
    return {
      message: 'Trang đăng ký',
    };
  }

  forgotPassword() {
    return {
      message: 'Trang quên mật khẩu',
    };
  }
}
