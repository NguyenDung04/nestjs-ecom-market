import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/role.enum';
import { API_MESSAGE } from '../../../common/constants/api-message.constant';

type RequestUser = {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  isActive: boolean;
};

type RequestWithUser = Request & {
  user?: RequestUser;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(API_MESSAGE.FORBIDDEN);
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(API_MESSAGE.FORBIDDEN);
    }

    return true;
  }
}
