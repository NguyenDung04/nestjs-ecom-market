# Nestjs Ecom Market

Nestjs Ecom Market là dự án website thương mại điện tử quy mô nhỏ, được xây dựng theo mô hình MVC kết hợp REST API. Hệ thống hỗ trợ các chức năng cơ bản của một website bán hàng như quản lý sản phẩm, danh mục, giỏ hàng, đặt hàng, thanh toán, phân quyền người dùng và quản trị đơn hàng.

Repository: `NguyenDung04/nestjs_ecom_market`

## Công nghệ sử dụng

| Thành phần     | Công nghệ                 |
| -------------- | ------------------------- |
| Backend        | NestJS                    |
| Database       | MySQL                     |
| ORM            | TypeORM                   |
| View Engine    | HBS                       |
| UI             | Tailwind CSS, Flowbite    |
| Authentication | JWT                       |
| Authorization  | Role-based Access Control |
| Architecture   | MVC + REST API            |

## Chức năng chính

### Người dùng

- Đăng ký, đăng nhập, đăng xuất.
- Xem danh sách sản phẩm.
- Tìm kiếm, lọc và sắp xếp sản phẩm.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Cập nhật số lượng hoặc xóa sản phẩm trong giỏ.
- Đặt hàng và chọn phương thức thanh toán.
- Theo dõi lịch sử đơn hàng.
- Xem chi tiết đơn hàng.
- Đánh giá sản phẩm sau khi mua.
- Quản lý thông tin tài khoản và địa chỉ giao hàng.

### Quản trị viên

- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý đơn hàng.
- Cập nhật trạng thái đơn hàng.
- Quản lý người dùng và phân quyền.
- Quản lý đánh giá.
- Quản lý mã giảm giá.
- Quản lý thanh toán.
- Theo dõi báo cáo thống kê.
- Cấu hình thông tin hệ thống.

## Vai trò người dùng

| Vai trò  | Mô tả                                                |
| -------- | ---------------------------------------------------- |
| Guest    | Người chưa đăng nhập, có thể xem sản phẩm            |
| Customer | Khách hàng đã đăng nhập, có thể mua hàng và đánh giá |
| Staff    | Nhân viên hỗ trợ xử lý đơn hàng                      |
| Admin    | Quản trị viên quản lý toàn bộ hệ thống               |

## Cơ sở dữ liệu

Tên database đề xuất:

```sql
CREATE DATABASE nestjs_ecom_market CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Các bảng chính:

- `users`
- `roles`
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`
- `addresses`
- `reviews`
- `coupons`
- `notifications`

## Trạng thái đơn hàng

| Trạng thái  | Ý nghĩa            |
| ----------- | ------------------ |
| `pending`   | Chờ xác nhận       |
| `confirmed` | Đã xác nhận        |
| `preparing` | Đang chuẩn bị hàng |
| `shipping`  | Đang giao hàng     |
| `completed` | Hoàn tất           |
| `cancelled` | Đã hủy             |
| `returned`  | Hoàn trả           |

## Trạng thái thanh toán

| Trạng thái | Ý nghĩa             |
| ---------- | ------------------- |
| `unpaid`   | Chưa thanh toán     |
| `paid`     | Đã thanh toán       |
| `failed`   | Thanh toán thất bại |
| `refunded` | Đã hoàn tiền        |

## Cài đặt dự án

Clone repository:

```bash
git clone https://github.com/NguyenDung04/nestjs-ecom-market.git
```

```bash
cd nestjs_ecom_market
```

Cài đặt thư viện:

```bash
npm install
```

Tạo database MySQL:

```sql
CREATE DATABASE nestjs_ecom_market CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tạo file `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=nestjs_ecom_market
JWT_SECRET=your_jwt_secret
```

Chạy migration:

```bash
npm run migration:run
```

Chạy dự án:

```bash
npm run start:dev
```

## Tác giả

- Họ tên: Nguyễn Trí Dũng
- Số điện thoại: 0378519357
- Vai trò: Fullstack Developer
- Công nghệ chính: NestJS, MySQL, TypeORM, HBS, Tailwind CSS, Flowbite, JWT

## Bản quyền

Dự án được xây dựng phục vụ mục đích học tập, thực hành và làm đồ án.

Copyright © 2026 Dũng Nguyễn. All rights reserved.
