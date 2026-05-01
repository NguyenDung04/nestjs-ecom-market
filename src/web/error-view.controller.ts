import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Controller render các trang lỗi của hệ thống.
 *
 * Công dụng:
 * - Render các trang lỗi phổ biến như 403, 404 và 500.
 * - Dùng layout chung layouts/error.
 * - Dùng getBaseData() để truyền dữ liệu chung cho giao diện lỗi.
 * - Controller này chỉ phụ trách hiển thị trang lỗi tĩnh.
 */
@Controller()
export class ErrorViewController {
  private readonly siteName = 'Ecom Market';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Tạo dữ liệu dùng chung cho các trang lỗi.
   *
   * Công dụng:
   * - Tránh lặp lại layout, siteName, siteShortName ở từng trang lỗi.
   * - Truyền statusCode và message tương ứng với từng loại lỗi.
   * - Truyền appUrl, appUrlApi và currentYear cho layout/footer.
   */
  private getBaseData(title: string, statusCode: number, message: string) {
    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:8080';

    const appUrlApi =
      this.configService.get<string>('APP_URL_API') || `${appUrl}/api`;

    return {
      layout: 'layouts/error',
      title,
      siteName: this.siteName,
      siteShortName: this.siteName.split(' ')[0],
      appUrl,
      appUrlApi,
      currentYear: new Date().getFullYear(),
      statusCode,
      message,
    };
  }

  /**
   * Render trang lỗi 403.
   *
   * Dùng khi người dùng đã đăng nhập nhưng không có đủ quyền truy cập.
   */
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

  /**
   * Render trang lỗi 404.
   *
   * Dùng khi đường dẫn không tồn tại hoặc tài nguyên đã bị di chuyển.
   */
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

  /**
   * Render trang lỗi 500.
   *
   * Dùng khi hệ thống hoặc máy chủ gặp lỗi trong quá trình xử lý.
   */
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
