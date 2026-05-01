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
      '/admin',
      '/admin/dashboard',

      '/admin/orders',
      '/admin/payments',
      '/admin/coupons',

      '/admin/products',
      '/admin/categories',
      '/admin/banners',
      '/admin/reviews',

      '/admin/contacts',

      '/admin/notifications',
    ];

    const adminOnlyPaths = [
      '/admin/roles',
      '/admin/users',
      '/admin/settings',
      '/admin/trash',
    ];

    const currentPath = request.path;

    const isAdminOnly = adminOnlyPaths.some((path) => {
      return currentPath === path || currentPath.startsWith(`${path}/`);
    });

    if (isAdminOnly) {
      response.redirect('/403');
      return false;
    }

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
