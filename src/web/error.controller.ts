import { Controller, Get, Render } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('errors')
export class WebErrorController {
  @Get('404')
  @Render('errors/404')
  notFoundPage() {
    return {
      title: 'Không tìm thấy trang',
      layout: 'layouts/error',
    };
  }

  @Get('500')
  @Render('errors/500')
  serverErrorPage() {
    return {
      title: 'Lỗi hệ thống',
      layout: 'layouts/error',
    };
  }
}
