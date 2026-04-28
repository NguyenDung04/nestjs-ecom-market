import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientViewService {
  getHomeData() {
    return {
      message: 'Chào mừng đến với Ecom Market',
    };
  }

  getProducts() {
    return [
      {
        id: 1,
        name: 'Áo thun nam basic',
        slug: 'ao-thun-nam-basic',
        category: 'Thời trang',
        price: 150000,
        description: 'Sản phẩm áo thun nam basic, chất liệu thoáng mát.',
      },
      {
        id: 2,
        name: 'Tai nghe Bluetooth',
        slug: 'tai-nghe-bluetooth',
        category: 'Điện tử',
        price: 450000,
        description: 'Tai nghe không dây, âm thanh rõ ràng, pin tốt.',
      },
      {
        id: 3,
        name: 'Balo laptop',
        slug: 'balo-laptop',
        category: 'Phụ kiện',
        price: 320000,
        description: 'Balo laptop chống sốc, phù hợp đi học và đi làm.',
      },
    ];
  }

  getProductBySlug(slug: string) {
    return this.getProducts().find((product) => product.slug === slug);
  }

  getOrders() {
    return [
      {
        id: 1,
        code: 'ORD001',
        customerName: 'Nguyễn Văn An',
        total: 450000,
        status: 'pending',
        createdAt: '28/04/2026',
      },
      {
        id: 2,
        code: 'ORD002',
        customerName: 'Trần Thị Bình',
        total: 780000,
        status: 'completed',
        createdAt: '28/04/2026',
      },
    ];
  }

  getOrderById(id: number) {
    return this.getOrders().find((order) => order.id === id);
  }
}
