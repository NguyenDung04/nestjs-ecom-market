import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class WebAdminController {
  @Get()
  @Render('admin/dashboard')
  dashboardPage() {
    return {
      title: 'Admin Dashboard',
      pageTitle: 'Dashboard',
      layout: 'layouts/admin',
    };
  }

  @Get('users')
  @Render('admin/users/index')
  usersPage() {
    return {
      title: 'Quản lý người dùng',
      pageTitle: 'Quản lý người dùng',
      layout: 'layouts/admin',
    };
  }

  @Get('categories')
  @Render('admin/categories/index')
  categoriesPage() {
    return {
      title: 'Quản lý danh mục',
      pageTitle: 'Quản lý danh mục',
      layout: 'layouts/admin',
    };
  }

  @Get('products')
  @Render('admin/products/index')
  productsPage() {
    return {
      title: 'Quản lý sản phẩm',
      pageTitle: 'Quản lý sản phẩm',
      layout: 'layouts/admin',
    };
  }
}
