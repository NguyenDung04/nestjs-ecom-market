import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Xác thực')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng mới' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'Đăng ký tài khoản thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ' })
  @ApiConflictResponse({ description: 'Email hoặc tên đăng nhập đã tồn tại' })
  @ApiTooManyRequestsResponse({
    description: 'Bạn đã đăng ký quá nhiều lần. Vui lòng thử lại sau',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Đăng nhập và nhận mã truy cập JWT' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Đăng nhập thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ' })
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không chính xác',
  })
  @ApiTooManyRequestsResponse({
    description: 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    const accessToken = result.data.accessToken;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return result;
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({ summary: 'Tạo mã xác nhận để đặt lại mật khẩu' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({
    description: 'Tạo mã xác nhận đặt lại mật khẩu thành công',
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ' })
  @ApiTooManyRequestsResponse({
    description:
      'Bạn đã yêu cầu đặt lại mật khẩu quá nhiều lần. Vui lòng thử lại sau',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({ summary: 'Đặt lại mật khẩu bằng mã xác nhận' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: 'Đặt lại mật khẩu thành công' })
  @ApiBadRequestResponse({
    description:
      'Mã xác nhận không hợp lệ, đã hết hạn hoặc dữ liệu gửi lên không hợp lệ',
  })
  @ApiTooManyRequestsResponse({
    description: 'Bạn đã đặt lại mật khẩu quá nhiều lần. Vui lòng thử lại sau',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng xuất và xóa cookie JWT' })
  @ApiOkResponse({ description: 'Đăng xuất thành công' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }
}
