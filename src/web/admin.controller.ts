import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class WebAdminController {
  @Get()
  @Render('admin/dashboard')
  dashboardPage() {
    return {
      title: 'Dashboard',
      layout: 'layouts/admin',
    };
  }

  @Get('products')
  @Render('admin/products')
  productsPage() {
    return {
      title: 'Quản lý sản phẩm',
      layout: 'layouts/admin',
    };
  }

  @Get('categories')
  @Render('admin/categories')
  categoriesPage() {
    return {
      title: 'Quản lý danh mục',
      layout: 'layouts/admin',
    };
  }

  @Get('orders')
  @Render('admin/orders')
  ordersPage() {
    return {
      title: 'Quản lý đơn hàng',
      layout: 'layouts/admin',
    };
  }
}
