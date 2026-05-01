/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { WebAuthGuard } from './guards/web-auth.guard';
import { WebAdminGuard } from './guards/web-admin.guard';
import type { WebAuthRequest } from './guards/web-auth.guard';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle({ default: true })
@Controller()
export class AdminViewController {
  private readonly siteName = 'Ecom Market';
  constructor(private readonly configService: ConfigService) {}

  private getViewData(
    request: WebAuthRequest,
    title: string,
    extra: Record<string, unknown> = {},
  ) {
    const authUser = request.user;
    const authRole = authUser?.role || null;

    const authName = authUser?.email || 'Admin';

    const authAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      authName,
    )}&background=0d9488&color=fff`;

    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:8080';

    const appUrlApi =
      this.configService.get<string>('APP_URL_API') || `${appUrl}/api`;

    return {
      layout: 'layouts/admin',
      title,
      siteName: this.siteName,
      appUrl,
      appUrlApi,
      currentYear: new Date().getFullYear(),

      authUser,
      authRole,
      authName,
      authAvatar,

      isAdmin: authRole === 'admin',
      isStaff: authRole === 'staff',
      isMember: authRole === 'member',

      ...extra,
    };
  }

  @Get('admin')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/dashboard/index')
  adminHome(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Dashboard / Thống kê tổng quan');
  }

  @Get('admin/dashboard')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/dashboard/index')
  dashboard(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Dashboard / Thống kê tổng quan');
  }

  @Get('admin/products')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/products/index')
  productsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý sản phẩm');
  }

  @Get('admin/categories')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/categories/index')
  categoriesView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý danh mục');
  }

  @Get('admin/banners')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/banners/index')
  bannersView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý banner');
  }

  @Get('admin/orders')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/orders/index')
  ordersView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý đơn hàng');
  }

  @Get('admin/users')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/users/index')
  usersView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý khách hàng / người dùng');
  }

  @Get('admin/coupons')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/coupons/index')
  couponsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý mã giảm giá');
  }

  @Get('admin/reviews')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/reviews/index')
  reviewsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý đánh giá');
  }

  @Get('admin/payments')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/payments/index')
  paymentsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý thanh toán');
  }

  @Get('admin/contacts')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/contacts/index')
  contactsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý liên hệ');
  }

  @Get('admin/roles')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/roles/index')
  rolesView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý vai trò & quyền');
  }

  @Get('admin/settings')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/settings/index')
  settingsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Cài đặt hệ thống');
  }

  @Get('admin/trash')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/trash/index')
  trashView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thùng rác');
  }

  @Get('admin/notifications')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/notifications/index')
  notificationsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thông báo toàn hệ thống');
  }
}
