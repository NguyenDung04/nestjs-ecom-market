import { Controller, Get, Param, Render } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller()
export class WebClientController {
  @Get()
  @Render('client/home')
  homePage() {
    return {
      title: 'Trang chủ',
      layout: 'layouts/client',
    };
  }

  @Get('products')
  @Render('client/products')
  productsPage() {
    return {
      title: 'Sản phẩm',
      layout: 'layouts/client',
    };
  }

  @Get('products/:id')
  @Render('client/product-detail')
  productDetailPage(@Param('id') id: string) {
    return {
      title: 'Chi tiết sản phẩm',
      layout: 'layouts/client',
      productId: id,
    };
  }

  @Get('profile')
  @Render('client/profile')
  profilePage() {
    return {
      title: 'Tài khoản của tôi',
      layout: 'layouts/client',
    };
  }
}
