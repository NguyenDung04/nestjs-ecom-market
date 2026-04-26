# Ecommerce Basic Plus

> Tài liệu phân tích và thiết kế hệ thống thương mại điện tử hoàn thiện ở mức cơ bản đến khá đầy đủ.

Repository: `NguyenDung04/ecommerce_basic_plus`

## 1. Giới thiệu

`Ecommerce Basic Plus` là mô hình website thương mại điện tử cho phép người dùng xem sản phẩm, tìm kiếm sản phẩm, thêm sản phẩm vào giỏ hàng, đặt hàng, thanh toán, theo dõi đơn hàng, đánh giá sản phẩm và quản lý tài khoản cá nhân.

Đối với quản trị viên, hệ thống hỗ trợ quản lý sản phẩm, danh mục, đơn hàng, người dùng, thanh toán, đánh giá, thống kê doanh thu và theo dõi hoạt động hệ thống.

Hệ thống phù hợp để làm đồ án, bài tập lớn, báo cáo phân tích hệ thống hoặc nền tảng phát triển website thương mại điện tử thực tế.

## 2. Mục tiêu hệ thống

- Xây dựng website thương mại điện tử có đầy đủ chức năng cơ bản.
- Hỗ trợ phân quyền người dùng theo vai trò.
- Quản lý sản phẩm, danh mục, giỏ hàng, đơn hàng và thanh toán.
- Hỗ trợ người dùng theo dõi lịch sử mua hàng và đánh giá sản phẩm.
- Hỗ trợ quản trị viên thống kê doanh thu, đơn hàng và sản phẩm bán chạy.
- Thiết kế cơ sở dữ liệu rõ ràng, dễ mở rộng và dễ bảo trì.

## 3. Phạm vi hệ thống

Một website thương mại điện tử hoàn thiện cơ bản nên có:

| Thành phần | Số lượng đề xuất |
|---|---:|
| Trang giao diện | 20 - 30 trang |
| Đối tượng chính | 12 - 18 đối tượng |
| Bảng cơ sở dữ liệu | 10 - 18 bảng |
| Nhóm vai trò người dùng | 2 - 4 nhóm |

## 4. Vai trò người dùng

| Vai trò | Mô tả |
|---|---|
| Guest | Người chưa đăng nhập, có thể xem sản phẩm, tìm kiếm và xem chi tiết sản phẩm |
| Customer | Khách hàng đã đăng nhập, có thể mua hàng, quản lý giỏ hàng, đặt hàng và đánh giá |
| Staff | Nhân viên hỗ trợ xử lý đơn hàng, xác nhận giao hàng và chăm sóc khách hàng |
| Admin | Quản trị viên quản lý toàn bộ hệ thống |

Đối với phiên bản cơ bản, có thể dùng 2 vai trò chính:

- `Admin`
- `Customer`

Đối với phiên bản đầy đủ hơn, nên dùng:

- `Admin`
- `Staff`
- `Customer`
- `Guest`

## 5. Chức năng phía người dùng

### 5.1. Trang chủ

Trang chủ là nơi hiển thị thông tin tổng quan của website.

| Thành phần | Mô tả |
|---|---|
| Header | Logo, menu, tìm kiếm, giỏ hàng, đăng nhập |
| Banner | Hình ảnh quảng cáo, chương trình khuyến mãi |
| Danh mục nổi bật | Hiển thị các nhóm sản phẩm chính |
| Sản phẩm mới | Các sản phẩm vừa được thêm |
| Sản phẩm bán chạy | Các sản phẩm có số lượng bán cao |
| Sản phẩm khuyến mãi | Các sản phẩm đang giảm giá |
| Footer | Thông tin liên hệ, chính sách, mạng xã hội |

Chức năng chính:

- Xem sản phẩm nổi bật.
- Tìm kiếm sản phẩm nhanh.
- Chuyển sang danh mục sản phẩm.
- Truy cập giỏ hàng.
- Đăng nhập hoặc đăng ký.

### 5.2. Trang danh sách sản phẩm

Trang danh sách sản phẩm hiển thị toàn bộ sản phẩm trong hệ thống.

| Thành phần | Mô tả |
|---|---|
| Danh sách sản phẩm | Hiển thị dạng lưới hoặc danh sách |
| Bộ lọc danh mục | Lọc sản phẩm theo danh mục |
| Bộ lọc giá | Lọc theo khoảng giá |
| Bộ lọc trạng thái | Còn hàng, hết hàng, đang giảm giá |
| Sắp xếp | Giá tăng dần, giảm dần, mới nhất, bán chạy |
| Phân trang | Chia sản phẩm thành nhiều trang |

Chức năng chính:

- Xem danh sách sản phẩm.
- Tìm kiếm sản phẩm.
- Lọc sản phẩm theo danh mục.
- Lọc sản phẩm theo giá.
- Sắp xếp sản phẩm.
- Chuyển sang chi tiết sản phẩm.
- Thêm nhanh vào giỏ hàng.

### 5.3. Trang chi tiết sản phẩm

Trang chi tiết sản phẩm hiển thị thông tin cụ thể của một sản phẩm.

| Thành phần | Mô tả |
|---|---|
| Ảnh sản phẩm | Một hoặc nhiều ảnh |
| Tên sản phẩm | Tên đầy đủ của sản phẩm |
| Giá bán | Giá hiện tại |
| Giá khuyến mãi | Nếu có giảm giá |
| Mô tả | Thông tin chi tiết |
| Số lượng còn lại | Tồn kho |
| Đánh giá | Số sao và bình luận |
| Sản phẩm liên quan | Gợi ý sản phẩm cùng danh mục |

Chức năng chính:

- Xem thông tin sản phẩm.
- Chọn số lượng.
- Thêm vào giỏ hàng.
- Mua ngay.
- Xem đánh giá.
- Gửi đánh giá nếu đã mua hàng.
- Xem sản phẩm liên quan.

### 5.4. Trang giỏ hàng

Trang giỏ hàng dùng để quản lý sản phẩm khách hàng đã chọn.

| Thành phần | Mô tả |
|---|---|
| Danh sách sản phẩm | Tên, ảnh, giá, số lượng |
| Cập nhật số lượng | Tăng hoặc giảm số lượng |
| Xóa sản phẩm | Xóa sản phẩm khỏi giỏ |
| Tổng tiền | Tổng tiền tạm tính |
| Mã giảm giá | Nhập coupon nếu có |
| Nút thanh toán | Chuyển sang trang đặt hàng |

Chức năng chính:

- Xem sản phẩm trong giỏ.
- Tăng giảm số lượng.
- Xóa sản phẩm.
- Tính tổng tiền.
- Áp dụng mã giảm giá.
- Chuyển sang thanh toán.

### 5.5. Trang thanh toán

Trang thanh toán là nơi người dùng xác nhận đơn hàng.

| Thành phần | Mô tả |
|---|---|
| Thông tin người nhận | Họ tên, số điện thoại, email |
| Địa chỉ giao hàng | Tỉnh/thành, quận/huyện, địa chỉ cụ thể |
| Ghi chú | Ghi chú cho người bán |
| Sản phẩm đặt mua | Danh sách sản phẩm |
| Tổng tiền | Tạm tính, phí ship, giảm giá, tổng thanh toán |
| Phương thức thanh toán | COD, chuyển khoản, ví điện tử, VNPay/Momo |

Chức năng chính:

- Nhập thông tin giao hàng.
- Chọn địa chỉ đã lưu.
- Chọn phương thức thanh toán.
- Kiểm tra lại đơn hàng.
- Xác nhận đặt hàng.

### 5.6. Trang đặt hàng thành công

Sau khi đặt hàng, người dùng được chuyển đến trang thông báo thành công.

| Thành phần | Mô tả |
|---|---|
| Mã đơn hàng | Mã dùng để tra cứu |
| Thông báo thành công | Xác nhận đơn đã được tạo |
| Tổng tiền | Số tiền cần thanh toán |
| Trạng thái | Chờ xác nhận |
| Nút xem đơn hàng | Chuyển sang chi tiết đơn |
| Nút tiếp tục mua hàng | Quay lại trang sản phẩm |

### 5.7. Trang đăng nhập

Thông tin cần có:

- Email hoặc tên đăng nhập.
- Mật khẩu.
- Ghi nhớ đăng nhập.
- Quên mật khẩu.
- Đăng nhập bằng Google nếu có.

Chức năng chính:

- Đăng nhập tài khoản.
- Kiểm tra thông tin đăng nhập.
- Phân quyền sau khi đăng nhập.
- Chuyển admin vào trang quản trị.
- Chuyển khách hàng về trang chủ.

### 5.8. Trang đăng ký

Thông tin cần có:

- Họ tên.
- Email.
- Số điện thoại.
- Mật khẩu.
- Xác nhận mật khẩu.

Chức năng chính:

- Tạo tài khoản khách hàng.
- Kiểm tra email đã tồn tại.
- Mã hóa mật khẩu.
- Tự động đăng nhập sau đăng ký nếu cần.

### 5.9. Trang quên mật khẩu

Chức năng chính:

- Nhập email.
- Gửi mã OTP hoặc link đặt lại mật khẩu.
- Xác minh mã.
- Đổi mật khẩu mới.

### 5.10. Trang tài khoản cá nhân

Thông tin cần quản lý:

- Họ tên.
- Email.
- Số điện thoại.
- Ảnh đại diện.
- Ngày tạo tài khoản.
- Đổi mật khẩu.

Chức năng chính:

- Xem thông tin cá nhân.
- Cập nhật thông tin.
- Đổi mật khẩu.
- Quản lý địa chỉ giao hàng.

### 5.11. Trang địa chỉ giao hàng

Thông tin địa chỉ:

- Tên người nhận.
- Số điện thoại.
- Tỉnh/thành phố.
- Quận/huyện.
- Phường/xã.
- Địa chỉ chi tiết.
- Địa chỉ mặc định.

Chức năng chính:

- Thêm địa chỉ.
- Sửa địa chỉ.
- Xóa địa chỉ.
- Đặt làm địa chỉ mặc định.

### 5.12. Trang lịch sử đơn hàng

| Thông tin | Mô tả |
|---|---|
| Mã đơn | Mã đơn hàng |
| Ngày đặt | Thời gian tạo đơn |
| Tổng tiền | Tổng giá trị đơn |
| Trạng thái | Chờ xác nhận, đang giao, hoàn tất |
| Thao tác | Xem chi tiết, hủy đơn, đánh giá |

Chức năng chính:

- Xem danh sách đơn hàng.
- Tìm kiếm đơn hàng theo mã.
- Lọc đơn hàng theo trạng thái.
- Xem chi tiết đơn hàng.
- Hủy đơn nếu chưa xử lý.

### 5.13. Trang chi tiết đơn hàng

Thông tin hiển thị:

- Mã đơn hàng.
- Thông tin người nhận.
- Địa chỉ giao hàng.
- Danh sách sản phẩm.
- Số lượng từng sản phẩm.
- Tổng tiền.
- Phương thức thanh toán.
- Trạng thái thanh toán.
- Trạng thái vận chuyển.
- Lịch sử cập nhật đơn hàng.

Chức năng chính:

- Theo dõi trạng thái đơn hàng.
- Xem sản phẩm đã mua.
- In hóa đơn nếu cần.
- Đánh giá sản phẩm sau khi hoàn tất.

### 5.14. Trang đánh giá sản phẩm

Người dùng chỉ nên được đánh giá khi đã mua sản phẩm.

Thông tin đánh giá:

- Số sao.
- Nội dung bình luận.
- Ảnh đánh giá nếu có.
- Thời gian đánh giá.

Chức năng chính:

- Thêm đánh giá.
- Sửa đánh giá.
- Xóa đánh giá của chính mình.
- Hiển thị đánh giá trên trang sản phẩm.

### 5.15. Trang yêu thích sản phẩm

Chức năng chính:

- Thêm sản phẩm vào yêu thích.
- Xem danh sách yêu thích.
- Xóa sản phẩm khỏi yêu thích.
- Chuyển sản phẩm yêu thích vào giỏ hàng.

### 5.16. Trang liên hệ

Thông tin:

- Họ tên.
- Email.
- Số điện thoại.
- Nội dung liên hệ.

Chức năng chính:

- Gửi liên hệ cho quản trị viên.
- Lưu nội dung liên hệ vào hệ thống.
- Admin phản hồi nếu cần.

## 6. Chức năng phía quản trị viên

### 6.1. Dashboard

Dashboard là trang tổng quan cho admin.

| Thành phần | Mô tả |
|---|---|
| Tổng doanh thu | Tổng tiền từ đơn hàng thành công |
| Tổng đơn hàng | Số lượng đơn hàng |
| Tổng sản phẩm | Số sản phẩm trong hệ thống |
| Tổng khách hàng | Số người dùng |
| Đơn hàng mới | Các đơn vừa được tạo |
| Biểu đồ doanh thu | Theo ngày, tháng, năm |
| Sản phẩm bán chạy | Top sản phẩm bán nhiều |
| Đơn hàng chờ xử lý | Đơn cần admin xác nhận |

### 6.2. Quản lý sản phẩm

Thông tin sản phẩm:

- Tên sản phẩm.
- Mã sản phẩm.
- Danh mục.
- Ảnh sản phẩm.
- Giá bán.
- Giá khuyến mãi.
- Số lượng tồn kho.
- Mô tả ngắn.
- Mô tả chi tiết.
- Trạng thái hiển thị.

Chức năng chính:

- Thêm sản phẩm.
- Sửa sản phẩm.
- Xóa sản phẩm.
- Ẩn/hiện sản phẩm.
- Tìm kiếm sản phẩm.
- Lọc sản phẩm theo danh mục.
- Quản lý tồn kho.
- Tải ảnh sản phẩm.

### 6.3. Thêm/sửa sản phẩm

Form nên có:

- Tên sản phẩm.
- Slug.
- Danh mục.
- Giá nhập.
- Giá bán.
- Giá giảm.
- Số lượng.
- Mô tả.
- Ảnh đại diện.
- Nhiều ảnh phụ.
- Trạng thái.

Validation cần có:

- Tên sản phẩm không được rỗng.
- Giá phải là số.
- Số lượng phải là số nguyên.
- Danh mục bắt buộc chọn.
- Ảnh đúng định dạng.

### 6.4. Quản lý danh mục

Thông tin danh mục:

- Tên danh mục.
- Slug.
- Ảnh danh mục.
- Mô tả.
- Trạng thái.
- Danh mục cha nếu có.

Chức năng chính:

- Thêm danh mục.
- Sửa danh mục.
- Xóa danh mục.
- Ẩn/hiện danh mục.
- Quản lý danh mục cha - con.

### 6.5. Quản lý đơn hàng

Thông tin đơn hàng:

- Mã đơn hàng.
- Tên khách hàng.
- Số điện thoại.
- Ngày đặt.
- Tổng tiền.
- Phương thức thanh toán.
- Trạng thái thanh toán.
- Trạng thái đơn hàng.

Chức năng chính:

- Xem danh sách đơn hàng.
- Tìm kiếm theo mã đơn.
- Lọc theo trạng thái.
- Xem chi tiết đơn hàng.
- Cập nhật trạng thái đơn hàng.
- Hủy đơn hàng.
- In hóa đơn.

### 6.6. Chi tiết đơn hàng cho admin

Thông tin hiển thị:

- Thông tin khách hàng.
- Thông tin người nhận.
- Địa chỉ giao hàng.
- Danh sách sản phẩm.
- Số lượng.
- Đơn giá.
- Thành tiền.
- Phí vận chuyển.
- Mã giảm giá.
- Tổng thanh toán.
- Trạng thái đơn.
- Ghi chú của khách.

Chức năng chính:

- Cập nhật trạng thái xử lý.
- Cập nhật trạng thái thanh toán.
- In hóa đơn.
- Gửi thông báo cho khách hàng.

### 6.7. Quản lý người dùng

Thông tin người dùng:

- Họ tên.
- Email.
- Số điện thoại.
- Vai trò.
- Trạng thái tài khoản.
- Ngày đăng ký.

Chức năng chính:

- Xem danh sách người dùng.
- Tìm kiếm người dùng.
- Khóa/mở khóa tài khoản.
- Phân quyền người dùng.
- Xem lịch sử mua hàng của người dùng.

### 6.8. Quản lý vai trò và quyền

Ví dụ vai trò:

- Admin.
- Nhân viên bán hàng.
- Nhân viên kho.
- Khách hàng.

Ví dụ quyền:

- Xem sản phẩm.
- Thêm sản phẩm.
- Sửa sản phẩm.
- Xóa sản phẩm.
- Xem đơn hàng.
- Cập nhật đơn hàng.
- Xem báo cáo.
- Quản lý người dùng.

Chức năng chính:

- Tạo vai trò.
- Gán quyền cho vai trò.
- Gán vai trò cho người dùng.
- Kiểm soát truy cập trang admin.

### 6.9. Quản lý đánh giá

Thông tin đánh giá:

- Tên người đánh giá.
- Sản phẩm được đánh giá.
- Số sao.
- Nội dung đánh giá.
- Ngày đánh giá.
- Trạng thái hiển thị.

Chức năng chính:

- Xem danh sách đánh giá.
- Ẩn đánh giá không phù hợp.
- Xóa đánh giá.
- Lọc đánh giá theo số sao.

### 6.10. Quản lý mã giảm giá

Thông tin mã giảm giá:

- Mã coupon.
- Loại giảm giá.
- Giá trị giảm.
- Ngày bắt đầu.
- Ngày kết thúc.
- Số lượt sử dụng.
- Giá trị đơn hàng tối thiểu.
- Trạng thái.

Loại giảm giá:

- Giảm theo phần trăm.
- Giảm theo số tiền cố định.
- Miễn phí vận chuyển.

### 6.11. Quản lý thanh toán

Thông tin thanh toán:

- Mã giao dịch.
- Mã đơn hàng.
- Khách hàng.
- Số tiền.
- Phương thức thanh toán.
- Trạng thái thanh toán.
- Thời gian thanh toán.

Trạng thái thanh toán:

- Chưa thanh toán.
- Đã thanh toán.
- Thanh toán thất bại.
- Đã hoàn tiền.

### 6.12. Quản lý tồn kho

Thông tin tồn kho:

- Sản phẩm.
- Số lượng nhập.
- Số lượng bán.
- Số lượng còn lại.
- Ngày nhập kho.
- Trạng thái tồn kho.

Chức năng chính:

- Theo dõi số lượng sản phẩm.
- Cảnh báo sắp hết hàng.
- Cập nhật nhập hàng.
- Cập nhật xuất hàng.
- Lịch sử thay đổi tồn kho.

### 6.13. Báo cáo thống kê

| Thống kê | Ý nghĩa |
|---|---|
| Doanh thu ngày | Tổng doanh thu trong ngày |
| Doanh thu tháng | Tổng doanh thu theo tháng |
| Doanh thu năm | Tổng doanh thu theo năm |
| Số đơn hàng | Tổng số đơn đã tạo |
| Đơn thành công | Đơn đã hoàn tất |
| Đơn bị hủy | Đơn bị hủy |
| Sản phẩm bán chạy | Sản phẩm có số lượng bán cao |
| Khách hàng mới | Người dùng mới đăng ký |
| Giá trị đơn trung bình | Tổng doanh thu / số đơn |

Chức năng chính:

- Lọc báo cáo theo ngày/tháng/năm.
- Xem biểu đồ doanh thu.
- Xem top sản phẩm bán chạy.
- Xuất báo cáo Excel/PDF nếu cần.

### 6.14. Quản lý banner

Thông tin banner:

- Tiêu đề.
- Ảnh banner.
- Đường dẫn.
- Vị trí hiển thị.
- Trạng thái.

Chức năng chính:

- Thêm banner.
- Sửa banner.
- Xóa banner.
- Ẩn/hiện banner.
- Sắp xếp thứ tự hiển thị.

### 6.15. Cài đặt hệ thống

Thông tin cài đặt:

- Tên website.
- Logo.
- Email liên hệ.
- Số điện thoại.
- Địa chỉ cửa hàng.
- Phí vận chuyển mặc định.
- Thông tin ngân hàng.
- Mạng xã hội.
- Chính sách mua hàng.

## 7. Tổng hợp số trang

### 7.1. Phiên bản cơ bản

| Nhóm | Số trang |
|---|---:|
| Trang người dùng | 10 |
| Trang admin | 6 |
| Tổng | 16 trang |

Các trang chính:

- Trang chủ.
- Danh sách sản phẩm.
- Chi tiết sản phẩm.
- Giỏ hàng.
- Thanh toán.
- Đặt hàng thành công.
- Đăng nhập.
- Đăng ký.
- Tài khoản cá nhân.
- Lịch sử đơn hàng.
- Dashboard admin.
- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý đơn hàng.
- Quản lý người dùng.
- Báo cáo thống kê.

### 7.2. Phiên bản hoàn thiện vừa đủ

| Nhóm | Số trang |
|---|---:|
| Trang người dùng | 14 |
| Trang admin | 10 |
| Tổng | 24 trang |

### 7.3. Phiên bản chuyên nghiệp

| Nhóm | Số trang |
|---|---:|
| Trang người dùng | 18 |
| Trang admin | 15 |
| Tổng | 33 trang |

Chức năng mở rộng:

- Wishlist.
- Mã giảm giá.
- Thông báo.
- Chat hỗ trợ.
- Quản lý kho.
- Quản lý vận chuyển.
- Quản lý banner.
- Quản lý thanh toán.
- Quản lý phân quyền.
- Xuất báo cáo.

## 8. Đối tượng chính trong hệ thống

| STT | Đối tượng | Vai trò |
|---:|---|---|
| 1 | User | Lưu thông tin người dùng |
| 2 | Role | Lưu vai trò người dùng |
| 3 | Permission | Lưu quyền thao tác |
| 4 | Category | Danh mục sản phẩm |
| 5 | Product | Sản phẩm |
| 6 | ProductImage | Ảnh sản phẩm |
| 7 | Cart | Giỏ hàng |
| 8 | CartItem | Chi tiết giỏ hàng |
| 9 | Order | Đơn hàng |
| 10 | OrderItem | Chi tiết đơn hàng |
| 11 | Payment | Thanh toán |
| 12 | Address | Địa chỉ giao hàng |
| 13 | Review | Đánh giá sản phẩm |
| 14 | Coupon | Mã giảm giá |
| 15 | Shipping | Vận chuyển |
| 16 | Inventory | Tồn kho |
| 17 | Notification | Thông báo |
| 18 | Banner | Banner quảng cáo |
| 19 | Contact | Liên hệ |
| 20 | Setting | Cài đặt hệ thống |

Bộ đối tượng khuyên dùng cho đồ án:

- User.
- Role.
- Category.
- Product.
- ProductImage.
- Cart.
- CartItem.
- Order.
- OrderItem.
- Payment.
- Address.
- Review.
- Coupon.
- Notification.

## 9. Cơ sở dữ liệu đề xuất

Tên database gợi ý:

```sql
CREATE DATABASE ecommerce_basic_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 9.1. Bảng `users`

Lưu thông tin tài khoản người dùng.

| Cột | Mô tả |
|---|---|
| id | Mã người dùng |
| name | Họ tên |
| email | Email đăng nhập |
| phone | Số điện thoại |
| password | Mật khẩu đã mã hóa |
| avatar | Ảnh đại diện |
| role_id | Vai trò |
| status | Trạng thái tài khoản |
| email_verified_at | Thời gian xác minh email |
| created_at | Thời gian tạo |
| updated_at | Thời gian cập nhật |

### 9.2. Bảng `roles`

Lưu vai trò người dùng.

| Cột | Mô tả |
|---|---|
| id | Mã vai trò |
| name | Tên vai trò |
| description | Mô tả vai trò |
| created_at | Thời gian tạo |
| updated_at | Thời gian cập nhật |

Dữ liệu mẫu:

- 1 - Admin.
- 2 - Staff.
- 3 - Customer.

### 9.3. Bảng `categories`

Lưu danh mục sản phẩm.

| Cột | Mô tả |
|---|---|
| id | Mã danh mục |
| name | Tên danh mục |
| slug | Đường dẫn thân thiện |
| image | Ảnh danh mục |
| description | Mô tả |
| parent_id | Danh mục cha |
| status | Trạng thái |
| created_at | Thời gian tạo |
| updated_at | Thời gian cập nhật |

### 9.4. Bảng `products`

Lưu thông tin sản phẩm.

| Cột | Mô tả |
|---|---|
| id | Mã sản phẩm |
| category_id | Thuộc danh mục nào |
| name | Tên sản phẩm |
| slug | Đường dẫn thân thiện |
| sku | Mã sản phẩm |
| price | Giá gốc |
| sale_price | Giá giảm |
| quantity | Số lượng tồn |
| short_description | Mô tả ngắn |
| description | Mô tả chi tiết |
| thumbnail | Ảnh đại diện |
| status | Trạng thái hiển thị |
| created_at | Thời gian tạo |
| updated_at | Thời gian cập nhật |

### 9.5. Các bảng còn lại

| Bảng | Mục đích |
|---|---|
| product_images | Lưu nhiều ảnh cho một sản phẩm |
| carts | Lưu giỏ hàng của người dùng |
| cart_items | Lưu chi tiết sản phẩm trong giỏ hàng |
| orders | Lưu đơn hàng |
| order_items | Lưu chi tiết sản phẩm trong đơn hàng |
| payments | Lưu thông tin thanh toán |
| addresses | Lưu địa chỉ giao hàng của người dùng |
| reviews | Lưu đánh giá sản phẩm |
| coupons | Lưu mã giảm giá |
| notifications | Lưu thông báo cho người dùng hoặc admin |

## 10. Quan hệ giữa các đối tượng

- Role 1 - N User.
- Category 1 - N Product.
- Product 1 - N ProductImage.
- User 1 - 1 Cart.
- Cart 1 - N CartItem.
- Product 1 - N CartItem.
- User 1 - N Order.
- Order 1 - N OrderItem.
- Product 1 - N OrderItem.
- Order 1 - 1 Payment.
- User 1 - N Address.
- User 1 - N Review.
- Product 1 - N Review.
- Order 1 - N Review.
- Coupon 1 - N Order.
- User 1 - N Notification.

## 11. Trạng thái đơn hàng

| Trạng thái | Ý nghĩa |
|---|---|
| pending | Chờ xác nhận |
| confirmed | Đã xác nhận |
| preparing | Đang chuẩn bị hàng |
| shipping | Đang giao hàng |
| completed | Giao hàng thành công |
| cancelled | Đã hủy |
| returned | Đã hoàn trả |

Hiển thị tiếng Việt:

- `pending` → Chờ xác nhận.
- `confirmed` → Đã xác nhận.
- `preparing` → Đang chuẩn bị.
- `shipping` → Đang giao hàng.
- `completed` → Hoàn tất.
- `cancelled` → Đã hủy.
- `returned` → Hoàn trả.

## 12. Trạng thái thanh toán

| Trạng thái | Ý nghĩa |
|---|---|
| unpaid | Chưa thanh toán |
| paid | Đã thanh toán |
| failed | Thanh toán thất bại |
| refunded | Đã hoàn tiền |

## 13. Luồng xử lý đặt hàng

```text
Người dùng xem sản phẩm
↓
Người dùng thêm sản phẩm vào giỏ hàng
↓
Người dùng vào giỏ hàng kiểm tra sản phẩm
↓
Người dùng chuyển sang thanh toán
↓
Người dùng nhập địa chỉ giao hàng
↓
Người dùng chọn phương thức thanh toán
↓
Hệ thống kiểm tra tồn kho
↓
Hệ thống tạo đơn hàng
↓
Hệ thống tạo chi tiết đơn hàng
↓
Hệ thống cập nhật số lượng tồn kho
↓
Hệ thống tạo thông tin thanh toán
↓
Hệ thống xóa giỏ hàng
↓
Người dùng nhận thông báo đặt hàng thành công
↓
Admin xác nhận đơn hàng
↓
Đơn hàng được giao
↓
Đơn hàng hoàn tất
↓
Người dùng đánh giá sản phẩm
```

## 14. Luồng xử lý quản trị đơn hàng

```text
Admin đăng nhập
↓
Vào trang quản lý đơn hàng
↓
Xem đơn hàng mới
↓
Kiểm tra thông tin khách hàng
↓
Kiểm tra sản phẩm và tồn kho
↓
Xác nhận đơn hàng
↓
Cập nhật trạng thái đang chuẩn bị
↓
Cập nhật trạng thái đang giao hàng
↓
Cập nhật trạng thái hoàn tất
↓
Hệ thống tính doanh thu
```

## 15. Thứ tự ưu tiên khi phát triển

### Giai đoạn 1: Nền tảng

- Tạo database.
- Tạo bảng users.
- Tạo đăng ký, đăng nhập.
- Tạo phân quyền admin/customer.
- Tạo layout người dùng.
- Tạo layout admin.

### Giai đoạn 2: Sản phẩm

- Tạo bảng categories.
- Tạo bảng products.
- Làm quản lý danh mục.
- Làm quản lý sản phẩm.
- Hiển thị sản phẩm ra trang chủ.
- Hiển thị danh sách sản phẩm.
- Hiển thị chi tiết sản phẩm.

### Giai đoạn 3: Giỏ hàng và đặt hàng

- Tạo bảng carts.
- Tạo bảng cart_items.
- Thêm sản phẩm vào giỏ.
- Cập nhật giỏ hàng.
- Tạo trang thanh toán.
- Tạo bảng orders.
- Tạo bảng order_items.
- Tạo đơn hàng.

### Giai đoạn 4: Quản lý đơn hàng

- Admin xem đơn hàng.
- Admin cập nhật trạng thái.
- Khách hàng xem lịch sử đơn hàng.
- Khách hàng xem chi tiết đơn hàng.
- Theo dõi trạng thái đơn hàng.

### Giai đoạn 5: Chức năng nâng cao

- Thanh toán online.
- Đánh giá sản phẩm.
- Mã giảm giá.
- Thông báo.
- Báo cáo thống kê.
- Quản lý tồn kho.
- Xuất hóa đơn.

## 16. Cấu trúc menu đề xuất

### Menu người dùng

- Trang chủ.
- Sản phẩm.
- Danh mục.
- Khuyến mãi.
- Giỏ hàng.
- Đơn hàng của tôi.
- Tài khoản.
- Liên hệ.

### Menu admin

- Dashboard.
- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý đơn hàng.
- Quản lý người dùng.
- Quản lý đánh giá.
- Quản lý mã giảm giá.
- Quản lý thanh toán.
- Báo cáo thống kê.
- Cài đặt hệ thống.

## 17. Yêu cầu phi chức năng

| Yêu cầu | Mô tả |
|---|---|
| Bảo mật | Mã hóa mật khẩu, phân quyền, chống SQL Injection, CSRF |
| Hiệu năng | Tải trang nhanh, phân trang sản phẩm |
| Dễ sử dụng | Giao diện rõ ràng, dễ thao tác |
| Responsive | Dùng tốt trên máy tính và điện thoại |
| Dễ bảo trì | Code chia controller, model, service rõ ràng |
| Sao lưu dữ liệu | Có cơ chế backup database |
| Kiểm tra dữ liệu | Validate form trước khi lưu |
| Thông báo lỗi | Hiển thị lỗi rõ ràng cho người dùng |

## 18. Migration và dữ liệu mẫu

Dự án có thể dùng MySQL với TypeORM migration.

Hai file migration gợi ý:

```text
1714000000000-CreateSchema.ts
1714000001000-SeedSampleData.ts
```

Trong đó:

- `1714000000000-CreateSchema.ts`: tạo schema, bảng, khóa chính, khóa ngoại, ràng buộc.
- `1714000001000-SeedSampleData.ts`: chèn dữ liệu mẫu cho vai trò, người dùng, danh mục, sản phẩm, đơn hàng, thanh toán, đánh giá, thông báo.

## 19. Cài đặt và chạy dự án

> Phần này dùng cho dự án Node.js/NestJS/TypeORM. Nếu dự án dùng công nghệ khác, có thể điều chỉnh lại lệnh tương ứng.

Clone repository:

```bash
git clone https://github.com/NguyenDung04/ecommerce_basic_plus.git
```

```bash
cd ecomerce_basic_plus
```

Cài đặt thư viện:

```bash
npm install
```

Tạo database MySQL:

```sql
CREATE DATABASE ecommerce_basic_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cấu hình file môi trường `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=ecommerce_basic_plus
```

Chạy migration:

```bash
npm run migration:run
```

Chạy dự án:

```bash
npm run start:dev
```

## 20. Kết luận

Với cấu trúc gồm khoảng 22 - 24 trang, 3 vai trò chính, 14 đối tượng và 14 bảng cơ sở dữ liệu, `Ecommerce Basic Plus` có thể xem là một hệ thống thương mại điện tử hoàn thiện ở mức cơ bản đến khá đầy đủ.

Hệ thống có thể dùng để phát triển thành website bán hàng thực tế hoặc làm nền tảng cho đồ án, báo cáo môn học và chuyên đề tốt nghiệp.
