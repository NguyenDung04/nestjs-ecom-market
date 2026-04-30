import { Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { WebAuthGuard } from './guards/web-auth.guard';
import { WebAdminGuard } from './guards/web-admin.guard';
import type { WebAuthRequest } from './guards/web-auth.guard';

@Controller('admin')
@UseGuards(WebAuthGuard, WebAdminGuard)
export class AdminViewController {
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
      authUser,
      authRole,
      isAdmin: authRole === 'admin',
      isStaff: authRole === 'staff',
      ...extra,
    };
  }

  @Get()
  @Render('admin/dashboard/index')
  adminHome(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Dashboard');
  }

  @Get('dashboard')
  @Render('admin/dashboard/index')
  dashboard(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Dashboard');
  }

  @Get('products')
  @Render('admin/products/index')
  productsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý sản phẩm');
  }

  @Get('products/create')
  @Render('admin/products/form')
  createProduct(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm sản phẩm', {
      action: '/admin/products/create',
    });
  }

  @Post('products/create')
  @Render('admin/products/form')
  storeProduct(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm sản phẩm', {
      action: '/admin/products/create',
      product: {},
      success: 'Thêm sản phẩm mẫu thành công.',
    });
  }

  @Get('categories')
  @Render('admin/categories/index')
  categories(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý danh mục');
  }

  @Get('categories/create')
  @Render('admin/categories/form')
  createCategory(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Thêm danh mục');
  }

  @Get('orders')
  @Render('admin/orders/index')
  ordersView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý đơn hàng');
  }

  @Get('contacts')
  @Render('admin/contacts/index')
  contactsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý liên hệ');
  }

  @Get('payments')
  @Render('admin/payments/index')
  paymentsView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý thanh toán');
  }

  @Get('users')
  @Render('admin/users/index')
  usersView(@Req() request: WebAuthRequest) {
    return this.getViewData(request, 'Quản lý người dùng');
  }
}
