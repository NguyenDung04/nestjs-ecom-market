import { Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { WebAuthGuard } from './guards/web-auth.guard';
import { WebAdminGuard } from './guards/web-admin.guard';
import type { WebAuthRequest } from './guards/web-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle({ default: true })
@Controller()
export class AdminViewController {
  private readonly siteName = 'Ecom Market';

  private getViewData(
    request: WebAuthRequest,
    title: string,
    extra: Record<string, unknown> = {},
  ) {
    const authUser = request.user;
    const authRole = authUser?.role || null;

    return {
      layout: 'layouts/admin',
      title,
      siteName: this.siteName,
      authUser,
      authRole,
      isAdmin: authRole === 'admin',
      isStaff: authRole === 'staff',
      isMember: authRole === 'member',
      ...extra,
    };
  }

  // =========================
  // ADMIN ROUTES
  // =========================

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

  @Get('admin/products/create')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/products/form')
  createProduct(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm sản phẩm', {
      action: '/admin/products/create',
      product: {},
    });
  }

  @Post('admin/products/create')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/products/form')
  storeProduct(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm sản phẩm', {
      action: '/admin/products/create',
      product: {},
      success: 'Thêm sản phẩm mẫu thành công.',
    });
  }

  @Get('admin/categories')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/categories/index')
  categories(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý danh mục');
  }

  @Get('admin/categories/create')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/categories/form')
  createCategory(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm danh mục', {
      action: '/admin/categories/create',
      category: {},
    });
  }

  @Post('admin/categories/create')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/categories/form')
  storeCategory(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm danh mục', {
      action: '/admin/categories/create',
      category: {},
      success: 'Thêm danh mục mẫu thành công.',
    });
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

  // Nếu vẫn muốn giữ trang thanh toán trong admin
  @Get('admin/payments')
  @UseGuards(WebAuthGuard, WebAdminGuard)
  @Render('admin/payments/index')
  paymentsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý thanh toán');
  }
}
