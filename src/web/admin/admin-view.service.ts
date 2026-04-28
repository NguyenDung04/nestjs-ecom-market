import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminViewService {
  getDashboard() {
    return {
      stats: {
        revenue: 25000000,
        orders: 128,
        products: 56,
        users: 320,
      },
    };
  }

  getProducts() {
    return [
      {
        id: 1,
        name: 'Áo thun nam basic',
        category: 'Thời trang',
        price: 150000,
        status: 'active',
      },
      {
        id: 2,
        name: 'Tai nghe Bluetooth',
        category: 'Điện tử',
        price: 450000,
        status: 'active',
      },
    ];
  }

  getProductById(id: number) {
    return this.getProducts().find((product) => product.id === id);
  }

  getOrders() {
    return [
      {
        id: 1,
        code: 'ORD001',
        customerName: 'Nguyễn Văn An',
        total: 450000,
        status: 'pending',
      },
      {
        id: 2,
        code: 'ORD002',
        customerName: 'Trần Thị Bình',
        total: 780000,
        status: 'completed',
      },
    ];
  }

  getOrderById(id: number) {
    return this.getOrders().find((order) => order.id === id);
  }

  getUsers() {
    return [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        role: 'Admin',
        status: 'active',
      },
      {
        id: 2,
        name: 'Nguyễn Văn An',
        email: 'an@example.com',
        role: 'Customer',
        status: 'active',
      },
    ];
  }
}
