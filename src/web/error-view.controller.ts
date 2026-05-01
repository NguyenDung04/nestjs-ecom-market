import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ErrorViewController {
  private readonly siteName = 'Ecom Market';

  private getBaseData(title: string, statusCode: number, message: string) {
    return {
      layout: 'layouts/error',
      title,
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      statusCode,
      message,
    };
  }

  @Get('403')
  @Render('errors/403')
  forbidden() {
    return {
      ...this.getBaseData(
        'Không có quyền truy cập',
        403,
        'Bạn không có quyền truy cập vào khu vực này.',
      ),
      errorTitle: 'Truy cập bị từ chối',
      errorDescription:
        'Tài khoản của bạn không có đủ quyền để xem trang này. Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ quản trị viên.',
    };
  }

  @Get('404')
  @Render('errors/404')
  notFound() {
    return {
      ...this.getBaseData(
        'Không tìm thấy trang',
        404,
        'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
      ),
      errorTitle: 'Không tìm thấy nội dung',
      errorDescription:
        'Đường dẫn bạn truy cập có thể không chính xác, nội dung đã bị xóa hoặc đã được chuyển sang vị trí khác.',
    };
  }

  @Get('500')
  @Render('errors/500')
  serverError() {
    return {
      ...this.getBaseData(
        'Lỗi hệ thống',
        500,
        'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
      ),
      errorTitle: 'Có lỗi xảy ra',
      errorDescription:
        'Máy chủ đang gặp sự cố trong quá trình xử lý yêu cầu. Đội ngũ kỹ thuật sẽ kiểm tra và khắc phục sớm nhất.',
    };
  }
}
