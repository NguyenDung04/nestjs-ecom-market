import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { WebAuthGuard } from './guards/web-auth.guard';
import { WebAdminGuard } from './guards/web-admin.guard';

@Controller('admin')
@UseGuards(WebAuthGuard, WebAdminGuard)
export class AdminViewController {
  @Get()
  @Render('admin/dashboard/index')
  adminHome() {
    return {
      layout: 'layouts/admin',
      title: 'Dashboard',
    };
  }

  @Get('dashboard')
  @Render('admin/dashboard/index')
  dashboard() {
    return {
      layout: 'layouts/admin',
      title: 'Dashboard',
    };
  }

  @Get('products')
  @Render('admin/products/index')
  productsView() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý sản phẩm',
    };
  }

  @Get('products/create')
  @Render('admin/products/form')
  createProduct() {
    return {
      layout: 'layouts/admin',
      title: 'Thêm sản phẩm',
      action: '/admin/products/create',
    };
  }

  @Post('products/create')
  @Render('admin/products/form')
  storeProduct() {
    return {
      layout: 'layouts/admin',
      title: 'Thêm sản phẩm',
      action: '/admin/products/create',
      product: {},
      success: 'Thêm sản phẩm mẫu thành công.',
    };
  }

  @Get('categories')
  @Render('admin/categories/index')
  categories() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý danh mục',
    };
  }

  @Get('categories/create')
  @Render('admin/categories/form')
  createCategory() {
    return {
      layout: 'layouts/admin',
      title: 'Thêm danh mục',
    };
  }

  @Get('orders')
  @Render('admin/orders/index')
  ordersView() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý đơn hàng',
    };
  }

  @Get('users')
  @Render('admin/users/index')
  usersView() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý người dùng',
    };
  }
}
