import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';

type WebJwtPayload = {
  sub: number;
  email: string;
  role: string;
};

export type WebAuthRequest = Request & {
  user?: WebJwtPayload;
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
};

@Injectable()
export class WebAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<WebAuthRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = request.cookies?.access_token;

    if (!accessToken) {
      response.redirect('/login');
      return false;
    }

    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'default_access_secret_change_me';

    try {
      const payload = await this.jwtService.verifyAsync<WebJwtPayload>(
        accessToken,
        {
          secret: accessSecret,
        },
      );

      request.user = payload;

      return true;
    } catch {
      response.redirect('/login');
      return false;
    }
  }
}
