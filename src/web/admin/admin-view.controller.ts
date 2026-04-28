import { Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AdminViewService } from './admin-view.service';

@Controller('admin')
export class AdminViewController {
  constructor(private readonly adminViewService: AdminViewService) {}

  @Get()
  @Render('admin/dashboard/index')
  adminHome() {
    return {
      layout: 'layouts/admin',
      title: 'Dashboard',
      ...this.adminViewService.getDashboard(),
    };
  }

  @Get('dashboard')
  @Render('admin/dashboard/index')
  dashboard() {
    return {
      layout: 'layouts/admin',
      title: 'Dashboard',
      ...this.adminViewService.getDashboard(),
    };
  }

  @Get('products')
  @Render('admin/products/index')
  products() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý sản phẩm',
      products: this.adminViewService.getProducts(),
    };
  }

  @Get('products/create')
  @Render('admin/products/form')
  createProduct() {
    return {
      layout: 'layouts/admin',
      title: 'Thêm sản phẩm',
      action: '/admin/products/create',
      product: {},
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

  @Get('products/:id/edit')
  @Render('admin/products/form')
  editProduct(@Param('id') id: string) {
    const product = this.adminViewService.getProductById(Number(id));

    return {
      layout: 'layouts/admin',
      title: 'Sửa sản phẩm',
      action: `/admin/products/${id}/edit`,
      product,
    };
  }

  @Post('products/:id/edit')
  @Render('admin/products/form')
  updateProduct(@Param('id') id: string) {
    const product = this.adminViewService.getProductById(Number(id));

    return {
      layout: 'layouts/admin',
      title: 'Sửa sản phẩm',
      action: `/admin/products/${id}/edit`,
      product,
      success: 'Cập nhật sản phẩm mẫu thành công.',
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
  orders() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý đơn hàng',
      orders: this.adminViewService.getOrders(),
    };
  }

  @Get('orders/:id')
  @Render('admin/orders/detail')
  orderDetail(@Param('id') id: string) {
    const order = this.adminViewService.getOrderById(Number(id));

    return {
      layout: 'layouts/admin',
      title: 'Chi tiết đơn hàng',
      order,
    };
  }

  @Get('users')
  @Render('admin/users/index')
  users() {
    return {
      layout: 'layouts/admin',
      title: 'Quản lý người dùng',
      users: this.adminViewService.getUsers(),
    };
  }
}
