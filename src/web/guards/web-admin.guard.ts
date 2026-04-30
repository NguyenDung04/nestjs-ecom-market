import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import type { WebAuthRequest } from './web-auth.guard';

@Injectable()
export class WebAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<WebAuthRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    const user = request.user;

    if (!user) {
      response.redirect('/login');
      return false;
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      response.redirect('/403');
      return false;
    }

    if (user.role === 'admin') {
      return true;
    }

    const allowedStaffPaths = [
      '/admin/orders',
      '/admin/contacts',
      '/admin/payments',
    ];

    const currentPath = request.path;

    const isAllowedForStaff = allowedStaffPaths.some((path) => {
      return currentPath === path || currentPath.startsWith(`${path}/`);
    });

    if (!isAllowedForStaff) {
      response.redirect('/403');
      return false;
    }

    return true;
  }
}
