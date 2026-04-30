/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';
import {
  AuthProvider,
  RoleName,
  UserStatus,
} from 'src/common/enums/ecommerce.enum';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly accessTokenCookieName = 'access_token';
  private readonly refreshTokenCookieName = 'refresh_token';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, phone, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    const existedUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existedUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const memberRole = await this.roleRepository.findOne({
      where: { name: RoleName.MEMBER },
    });

    if (!memberRole) {
      throw new BadRequestException('Role member chưa tồn tại trong hệ thống');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      phone: phone || null,
      password: passwordHash,
      avatar: null,
      provider: AuthProvider.LOCAL,
      providerId: null,
      roleId: memberRole.id,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: null,
    });

    const savedUser = await this.userRepository.save(user);

    savedUser.role = memberRole;

    return {
      message: 'Đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.',
      data: this.sanitizeUser(savedUser),
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    this.ensureUserCanLogin(user);

    if (!user.password) {
      throw new UnauthorizedException(
        'Tài khoản này không sử dụng mật khẩu local',
      );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = this.buildJwtPayload(user);

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    await this.saveRefreshToken(user.id, refreshToken);

    this.setAuthCookies(response, accessToken, refreshToken);

    return {
      message: 'Đăng nhập thành công',
      data: {
        user: this.sanitizeUser(user),
      },
    };
  }

  async me(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    return {
      message: 'Lấy thông tin tài khoản thành công',
      data: this.sanitizeUser(user),
    };
  }

  async refreshToken(oldRefreshToken: string | undefined, response: Response) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Không tìm thấy refresh token');
    }

    const payload = await this.verifyRefreshToken(oldRefreshToken);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token không tồn tại');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token đã bị thu hồi');
    }

    if (storedToken.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    this.ensureUserCanLogin(user);

    storedToken.revokedAt = new Date();
    await this.refreshTokenRepository.save(storedToken);

    const newPayload = this.buildJwtPayload(user);

    const newAccessToken = await this.generateAccessToken(newPayload);
    const newRefreshToken = await this.generateRefreshToken(newPayload);

    await this.saveRefreshToken(user.id, newRefreshToken);

    this.setAuthCookies(response, newAccessToken, newRefreshToken);

    return {
      message: 'Làm mới token thành công',
      data: {
        user: this.sanitizeUser(user),
      },
    };
  }

  async logout(refreshToken: string | undefined, response: Response) {
    if (refreshToken) {
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken },
      });

      if (storedToken && !storedToken.revokedAt) {
        storedToken.revokedAt = new Date();
        await this.refreshTokenRepository.save(storedToken);
      }
    }

    this.clearAuthCookies(response);

    return {
      message: 'Đăng xuất thành công',
    };
  }

  private ensureUserCanLogin(user: User): void {
    if (
      user.status === UserStatus.INACTIVE ||
      user.status === UserStatus.BLOCKED
    ) {
      throw new ForbiddenException(
        'Tài khoản đã bị khóa hoặc chưa được kích hoạt',
      );
    }

    if (!user.role) {
      throw new ForbiddenException('Tài khoản chưa được gán quyền');
    }
  }

  private buildJwtPayload(user: User): JwtPayload {
    if (!user.role) {
      throw new ForbiddenException('Tài khoản chưa được gán quyền');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'default_access_secret_change_me';

    return this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'default_refresh_secret_change_me';

    return this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'default_refresh_secret_change_me';

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  private async saveRefreshToken(
    userId: number,
    token: string,
  ): Promise<RefreshToken> {
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
      revokedAt: null,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie(this.accessTokenCookieName, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie(this.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(response: Response): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.clearCookie(this.accessTokenCookieName, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });

    response.clearCookie(this.refreshTokenCookieName, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      provider: user.provider,
      providerId: user.providerId,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            description: user.role.description,
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
