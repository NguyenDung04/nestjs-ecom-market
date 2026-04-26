/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { API_MESSAGE } from '../../common/constants/api-message.constant';
import { normalizeEmail } from '../../common/utils/string.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = normalizeEmail(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      dto: {
        ...dto,
        email: normalizedEmail,
      },
      passwordHash,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: API_MESSAGE.REGISTER_SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
        },
        accessToken,
      },
    };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = normalizeEmail(dto.email);
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: API_MESSAGE.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
        },
        accessToken,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await this.usersService.saveResetPasswordToken({
      email: normalizeEmail(dto.email),
      token,
      expiresAt,
    });

    const showResetToken = process.env.SHOW_RESET_TOKEN_IN_RESPONSE === 'true';

    return {
      message: 'Tạo mã xác nhận đặt lại mật khẩu thành công',
      data: showResetToken
        ? {
            resetToken: token,
            expiresAt: expiresAt.toISOString(),
          }
        : null,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByResetPasswordToken(dto.token);

    if (!user) {
      throw new BadRequestException('Mã xác nhận không hợp lệ');
    }

    if (!user.resetPasswordExpiresAt) {
      throw new BadRequestException('Mã xác nhận đã hết hạn');
    }

    if (user.resetPasswordExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Mã xác nhận đã hết hạn');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.usersService.updatePassword({
      userId: user.id,
      passwordHash,
    });

    return {
      message: 'Đặt lại mật khẩu thành công',
      data: null,
    };
  }
}
