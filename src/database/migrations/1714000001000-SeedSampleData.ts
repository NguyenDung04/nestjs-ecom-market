import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSampleData1714000001000 implements MigrationInterface {
  name = 'SeedSampleData1714000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await queryRunner.query(`
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Quản trị viên toàn quyền hệ thống'),
(2, 'staff', 'Nhân viên xử lý đơn hàng và chăm sóc khách hàng'),
(3, 'customer', 'Khách hàng mua sản phẩm trên website');
    `);

    await queryRunner.query(`
INSERT INTO users (id, role_id, name, email, phone, password, avatar, status, email_verified_at) VALUES
(1, 1, 'Nguyễn Văn Admin', 'admin@example.com', '0900000001', '$2y$10$wH6JmUZ4ErvNko2NdVY0LOUpKZATcMsjl4Vcz3jp2HP4b6w4rSCnG', 'avatars/admin.png', 'active', NOW()),
(2, 2, 'Trần Thị Staff', 'staff@example.com', '0900000002', '$2y$10$wH6JmUZ4ErvNko2NdVY0LOUpKZATcMsjl4Vcz3jp2HP4b6w4rSCnG', 'avatars/staff.png', 'active', NOW()),
(3, 3, 'Lê Minh Khách', 'customer1@example.com', '0900000003', '$2y$10$wH6JmUZ4ErvNko2NdVY0LOUpKZATcMsjl4Vcz3jp2HP4b6w4rSCnG', 'avatars/customer1.png', 'active', NOW()),
(4, 3, 'Phạm Ngọc Anh', 'customer2@example.com', '0900000004', '$2y$10$wH6JmUZ4ErvNko2NdVY0LOUpKZATcMsjl4Vcz3jp2HP4b6w4rSCnG', NULL, 'active', NOW()),
(5, 3, 'Hoàng Đức Huy', 'customer3@example.com', '0900000005', '$2y$10$wH6JmUZ4ErvNko2NdVY0LOUpKZATcMsjl4Vcz3jp2HP4b6w4rSCnG', NULL, 'locked', NOW()),
(6, 3, 'Đỗ Thanh Tâm', 'customer4@example.com', '0900000006', '$2y$10$wH6JmUZ4ErvNko2NdVY0LOUpKZATcMsjl4Vcz3jp2HP4b6w4rSCnG', NULL, 'inactive', NULL);
    `);

    await queryRunner.query(`
INSERT INTO categories (id, parent_id, name, slug, image, description, status) VALUES
(1, NULL, 'Điện thoại', 'dien-thoai', 'categories/phone.jpg', 'Các dòng điện thoại thông minh', 'active'),
(2, NULL, 'Laptop', 'laptop', 'categories/laptop.jpg', 'Laptop học tập, văn phòng và gaming', 'active'),
(3, NULL, 'Thời trang', 'thoi-trang', 'categories/fashion.jpg', 'Sản phẩm thời trang nam nữ', 'active'),
(4, NULL, 'Đồ gia dụng', 'do-gia-dung', 'categories/home.jpg', 'Thiết bị và đồ dùng gia đình', 'active'),
(5, NULL, 'Mỹ phẩm', 'my-pham', 'categories/cosmetic.jpg', 'Sản phẩm chăm sóc cá nhân', 'active'),
(6, 1, 'Phụ kiện điện thoại', 'phu-kien-dien-thoai', 'categories/accessory.jpg', 'Ốp lưng, sạc, tai nghe', 'active'),
(7, 2, 'Laptop gaming', 'laptop-gaming', 'categories/gaming-laptop.jpg', 'Laptop cấu hình cao cho chơi game', 'active'),
(8, NULL, 'Danh mục ngừng bán', 'danh-muc-ngung-ban', NULL, 'Danh mục không còn kinh doanh', 'inactive');
    `);

    await queryRunner.query(`
INSERT INTO products (id, category_id, name, slug, sku, price, sale_price, quantity, short_description, description, thumbnail, status) VALUES
(1, 1, 'iPhone 15 128GB', 'iphone-15-128gb', 'IP15-128', 21990000, 20990000, 20, 'Điện thoại iPhone 15 bản 128GB', 'Màn hình đẹp, hiệu năng mạnh, camera chất lượng cao.', 'products/iphone-15.jpg', 'active'),
(2, 1, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'SS-S24', 19990000, 18490000, 15, 'Flagship Samsung Galaxy S24', 'Thiết kế cao cấp, camera tốt, hỗ trợ AI.', 'products/s24.jpg', 'active'),
(3, 6, 'Tai nghe Bluetooth Pro', 'tai-nghe-bluetooth-pro', 'PK-TN-PRO', 990000, 790000, 50, 'Tai nghe không dây chống ồn', 'Pin lâu, âm thanh rõ, kết nối ổn định.', 'products/headphone.jpg', 'active'),
(4, 2, 'MacBook Air M2 13 inch', 'macbook-air-m2-13-inch', 'MBA-M2-13', 26990000, 24990000, 10, 'Laptop mỏng nhẹ dùng chip M2', 'Phù hợp học tập, văn phòng, thiết kế nhẹ.', 'products/macbook-air-m2.jpg', 'active'),
(5, 7, 'Laptop Gaming RTX 4060', 'laptop-gaming-rtx-4060', 'LAP-GAMING-4060', 32990000, 29990000, 6, 'Laptop gaming cấu hình mạnh', 'CPU mạnh, GPU RTX 4060, màn hình 144Hz.', 'products/gaming-4060.jpg', 'active'),
(6, 3, 'Áo thun nam basic', 'ao-thun-nam-basic', 'FASHION-AT-001', 199000, 159000, 100, 'Áo thun nam đơn giản', 'Chất liệu cotton thoáng mát.', 'products/ao-thun.jpg', 'active'),
(7, 4, 'Nồi chiên không dầu 5L', 'noi-chien-khong-dau-5l', 'HOME-NCKD-5L', 1890000, 1490000, 12, 'Nồi chiên không dầu dung tích 5L', 'Tiện lợi cho gia đình, dễ vệ sinh.', 'products/noi-chien.jpg', 'active'),
(8, 5, 'Sữa rửa mặt dịu nhẹ', 'sua-rua-mat-diu-nhe', 'COS-SRM-001', 250000, NULL, 30, 'Sữa rửa mặt cho da nhạy cảm', 'Làm sạch nhẹ nhàng, không gây khô da.', 'products/sua-rua-mat.jpg', 'active'),
(9, 6, 'Sạc nhanh Type-C 30W', 'sac-nhanh-type-c-30w', 'PK-SAC-30W', 350000, 290000, 0, 'Củ sạc nhanh Type-C', 'Hỗ trợ sạc nhanh cho nhiều thiết bị.', 'products/sac-30w.jpg', 'out_of_stock'),
(10, 8, 'Máy nghe nhạc cũ', 'may-nghe-nhac-cu', 'OLD-MP3', 500000, NULL, 0, 'Sản phẩm đã ngừng kinh doanh', 'Không còn bán trên hệ thống.', 'products/mp3-old.jpg', 'inactive');
    `);

    await queryRunner.query(`
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(1, 'products/iphone-15-1.jpg', 1),
(1, 'products/iphone-15-2.jpg', 2),
(2, 'products/s24-1.jpg', 1),
(2, 'products/s24-2.jpg', 2),
(4, 'products/macbook-air-m2-1.jpg', 1),
(5, 'products/gaming-4060-1.jpg', 1),
(7, 'products/noi-chien-1.jpg', 1),
(8, 'products/sua-rua-mat-1.jpg', 1);
    `);

    await queryRunner.query(`
INSERT INTO addresses (id, user_id, receiver_name, receiver_phone, province, district, ward, address_detail, is_default) VALUES
(1, 3, 'Lê Minh Khách', '0900000003', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 'Số 12 đường Xuân Thủy', 1),
(2, 3, 'Lê Minh Khách', '0900000003', 'Hà Nội', 'Đống Đa', 'Láng Thượng', 'Số 88 Chùa Láng', 0),
(3, 4, 'Phạm Ngọc Anh', '0900000004', 'Ninh Bình', 'Hoa Lư', 'Ninh Hải', 'Thôn Văn Lâm', 1),
(4, 5, 'Hoàng Đức Huy', '0900000005', 'TP Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 'Số 20 Lê Lợi', 1);
    `);

    await queryRunner.query(`
INSERT INTO carts (id, user_id) VALUES
(1, 3),
(2, 4),
(3, 5);
    `);

    await queryRunner.query(`
INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
(1, 3, 2, 790000),
(1, 8, 1, 250000),
(2, 6, 3, 159000),
(3, 2, 1, 18490000);
    `);

    await queryRunner.query(`
INSERT INTO coupons (id, code, type, value, min_order_amount, max_discount_amount, usage_limit, used_count, start_date, end_date, status) VALUES
(1, 'SALE10', 'percent', 10, 500000, 300000, 100, 2, '2026-01-01', '2026-12-31', 'active'),
(2, 'GIAM100K', 'fixed', 100000, 1000000, NULL, 50, 1, '2026-01-01', '2026-12-31', 'active'),
(3, 'FREESHIP', 'free_shipping', 0, 300000, NULL, 200, 3, '2026-01-01', '2026-12-31', 'active'),
(4, 'EXPIRED50', 'percent', 50, 1000000, 500000, 10, 10, '2025-01-01', '2025-12-31', 'expired'),
(5, 'INACTIVE20', 'percent', 20, 500000, 200000, 100, 0, '2026-01-01', '2026-12-31', 'inactive');
    `);

    await queryRunner.query(`
INSERT INTO orders (id, user_id, coupon_id, order_code, customer_name, customer_phone, customer_email, shipping_address, note, subtotal, shipping_fee, discount_amount, total_amount, payment_method, payment_status, order_status, created_at) VALUES
(1, 3, 1, 'ORD-20260426-0001', 'Lê Minh Khách', '0900000003', 'customer1@example.com', 'Số 12 đường Xuân Thủy, Dịch Vọng, Cầu Giấy, Hà Nội', 'Giao giờ hành chính', 20990000, 30000, 300000, 20720000, 'cod', 'unpaid', 'pending', '2026-04-20 09:10:00'),
(2, 3, 2, 'ORD-20260426-0002', 'Lê Minh Khách', '0900000003', 'customer1@example.com', 'Số 88 Chùa Láng, Láng Thượng, Đống Đa, Hà Nội', NULL, 18490000, 30000, 100000, 18420000, 'bank_transfer', 'paid', 'confirmed', '2026-04-21 10:15:00'),
(3, 4, 3, 'ORD-20260426-0003', 'Phạm Ngọc Anh', '0900000004', 'customer2@example.com', 'Thôn Văn Lâm, Ninh Hải, Hoa Lư, Ninh Bình', 'Gọi trước khi giao', 477000, 30000, 30000, 477000, 'momo', 'paid', 'preparing', '2026-04-22 11:20:00'),
(4, 4, NULL, 'ORD-20260426-0004', 'Phạm Ngọc Anh', '0900000004', 'customer2@example.com', 'Thôn Văn Lâm, Ninh Hải, Hoa Lư, Ninh Bình', NULL, 1490000, 30000, 0, 1520000, 'vnpay', 'paid', 'shipping', '2026-04-23 12:30:00'),
(5, 3, NULL, 'ORD-20260426-0005', 'Lê Minh Khách', '0900000003', 'customer1@example.com', 'Số 12 đường Xuân Thủy, Dịch Vọng, Cầu Giấy, Hà Nội', NULL, 24990000, 0, 0, 24990000, 'paypal', 'paid', 'completed', '2026-04-24 08:00:00'),
(6, 5, NULL, 'ORD-20260426-0006', 'Hoàng Đức Huy', '0900000005', 'customer3@example.com', 'Số 20 Lê Lợi, Bến Nghé, Quận 1, TP Hồ Chí Minh', 'Khách hủy do đặt nhầm', 790000, 30000, 0, 820000, 'cod', 'unpaid', 'cancelled', '2026-04-24 14:00:00'),
(7, 4, NULL, 'ORD-20260426-0007', 'Phạm Ngọc Anh', '0900000004', 'customer2@example.com', 'Thôn Văn Lâm, Ninh Hải, Hoa Lư, Ninh Bình', 'Hoàn trả do lỗi sản phẩm', 19990000, 30000, 0, 20020000, 'vnpay', 'refunded', 'returned', '2026-04-25 16:00:00'),
(8, NULL, NULL, 'ORD-20260426-0008', 'Khách vãng lai', '0911111111', 'guest@example.com', 'Số 1 Tràng Tiền, Hoàn Kiếm, Hà Nội', 'Đơn khách chưa đăng nhập', 250000, 30000, 0, 280000, 'cod', 'unpaid', 'pending', '2026-04-26 08:30:00'),
(9, 6, NULL, 'ORD-20260426-0009', 'Đỗ Thanh Tâm', '0900000006', 'customer4@example.com', 'Số 9 Kim Mã, Ba Đình, Hà Nội', 'Thanh toán lỗi', 350000, 30000, 0, 380000, 'vnpay', 'failed', 'cancelled', '2026-04-26 09:00:00');
    `);

    await queryRunner.query(`
INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total) VALUES
(1, 1, 'iPhone 15 128GB', 'products/iphone-15.jpg', 1, 20990000, 20990000),
(2, 2, 'Samsung Galaxy S24', 'products/s24.jpg', 1, 18490000, 18490000),
(3, 6, 'Áo thun nam basic', 'products/ao-thun.jpg', 3, 159000, 477000),
(4, 7, 'Nồi chiên không dầu 5L', 'products/noi-chien.jpg', 1, 1490000, 1490000),
(5, 4, 'MacBook Air M2 13 inch', 'products/macbook-air-m2.jpg', 1, 24990000, 24990000),
(6, 3, 'Tai nghe Bluetooth Pro', 'products/headphone.jpg', 1, 790000, 790000),
(7, 2, 'Samsung Galaxy S24', 'products/s24.jpg', 1, 18490000, 18490000),
(7, 8, 'Sữa rửa mặt dịu nhẹ', 'products/sua-rua-mat.jpg', 6, 250000, 1500000),
(8, 8, 'Sữa rửa mặt dịu nhẹ', 'products/sua-rua-mat.jpg', 1, 250000, 250000),
(9, 9, 'Sạc nhanh Type-C 30W', 'products/sac-30w.jpg', 1, 350000, 350000);
    `);

    await queryRunner.query(`
INSERT INTO payments (order_id, payment_method, transaction_code, amount, status, paid_at) VALUES
(1, 'cod', NULL, 20720000, 'unpaid', NULL),
(2, 'bank_transfer', 'BANK-20260421-ABC', 18420000, 'paid', '2026-04-21 10:20:00'),
(3, 'momo', 'MOMO-20260422-XYZ', 477000, 'paid', '2026-04-22 11:25:00'),
(4, 'vnpay', 'VNPAY-20260423-001', 1520000, 'paid', '2026-04-23 12:35:00'),
(5, 'paypal', 'PAYPAL-20260424-001', 24990000, 'paid', '2026-04-24 08:05:00'),
(6, 'cod', NULL, 820000, 'unpaid', NULL),
(7, 'vnpay', 'VNPAY-REFUND-20260425-001', 20020000, 'refunded', '2026-04-25 16:20:00'),
(8, 'cod', NULL, 280000, 'unpaid', NULL),
(9, 'vnpay', 'VNPAY-FAILED-20260426-001', 380000, 'failed', NULL);
    `);

    await queryRunner.query(`
INSERT INTO reviews (user_id, product_id, order_id, rating, comment, status, created_at) VALUES
(3, 4, 5, 5, 'Máy đẹp, chạy mượt, pin tốt. Rất hài lòng.', 'visible', '2026-04-25 09:00:00'),
(4, 2, 7, 2, 'Sản phẩm bị lỗi nên đã hoàn trả.', 'hidden', '2026-04-26 10:00:00'),
(4, 8, 7, 4, 'Sản phẩm dùng ổn, đóng gói cẩn thận.', 'pending', '2026-04-26 10:10:00');
    `);

    await queryRunner.query(`
INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
(1, 'Có đơn hàng mới', 'Đơn hàng ORD-20260426-0001 đang chờ xác nhận.', 'order', 0, '2026-04-20 09:12:00'),
(3, 'Đặt hàng thành công', 'Đơn hàng ORD-20260426-0001 của bạn đã được tạo thành công.', 'order', 1, '2026-04-20 09:11:00'),
(3, 'Thanh toán thành công', 'Đơn hàng ORD-20260426-0002 đã thanh toán thành công.', 'payment', 1, '2026-04-21 10:21:00'),
(4, 'Đơn hàng đang giao', 'Đơn hàng ORD-20260426-0004 đang được giao đến bạn.', 'order', 0, '2026-04-23 13:00:00'),
(1, 'Cảnh báo tồn kho', 'Sản phẩm Sạc nhanh Type-C 30W đã hết hàng.', 'inventory', 0, '2026-04-24 15:00:00'),
(NULL, 'Khuyến mãi mới', 'Mã SALE10 đang được áp dụng cho đơn hàng từ 500.000đ.', 'promotion', 0, '2026-04-25 08:00:00');
    `);

    await queryRunner.query(`
INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('Nguyễn Khách Lẻ', 'guest1@example.com', '0988888888', 'Hỏi về bảo hành', 'Sản phẩm điện thoại được bảo hành bao lâu?', 'new'),
('Trần Minh', 'guest2@example.com', '0977777777', 'Hỗ trợ đơn hàng', 'Tôi muốn kiểm tra tình trạng giao hàng.', 'processing'),
('Lê Hà', 'guest3@example.com', NULL, 'Góp ý website', 'Giao diện dễ dùng, nhưng nên thêm bộ lọc giá.', 'replied');
    `);

    await queryRunner.query(`
INSERT INTO banners (title, image, link, position, sort_order, status) VALUES
('Siêu sale điện thoại tháng 4', 'banners/sale-phone.jpg', '/products?category=dien-thoai', 'home_top', 1, 'active'),
('Laptop giảm giá mạnh', 'banners/laptop-sale.jpg', '/products?category=laptop', 'home_middle', 2, 'active'),
('Banner cũ đã ẩn', 'banners/old-banner.jpg', '#', 'home_top', 3, 'inactive');
    `);

    await queryRunner.query(`
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'Ecommerce Basic Plus', 'Tên website'),
('site_logo', 'logo.png', 'Logo website'),
('contact_email', 'support@example.com', 'Email liên hệ'),
('contact_phone', '1900 9999', 'Số điện thoại hỗ trợ'),
('store_address', 'Hà Nội, Việt Nam', 'Địa chỉ cửa hàng'),
('default_shipping_fee', '30000', 'Phí vận chuyển mặc định'),
('bank_info', 'Ngân hàng ABC - STK 123456789 - Chủ TK Ecommerce Basic Plus', 'Thông tin chuyển khoản');
    `);

    await queryRunner.query(`
INSERT INTO inventory_logs (product_id, user_id, type, quantity, note, created_at) VALUES
(1, 1, 'import', 30, 'Nhập lô iPhone 15 đầu kỳ', '2026-04-01 08:00:00'),
(1, 2, 'export', 1, 'Xuất kho cho đơn ORD-20260426-0001', '2026-04-20 09:15:00'),
(4, 1, 'import', 15, 'Nhập MacBook Air M2', '2026-04-02 09:00:00'),
(4, 2, 'export', 1, 'Xuất kho cho đơn ORD-20260426-0005', '2026-04-24 08:10:00'),
(9, 2, 'adjustment', -2, 'Điều chỉnh tồn kho do kiểm kê', '2026-04-24 14:30:00'),
(2, 2, 'return', 1, 'Khách hoàn trả đơn ORD-20260426-0007', '2026-04-25 17:00:00');
    `);

    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await queryRunner.query(`DELETE FROM \`inventory_logs\`;`);
    await queryRunner.query(`DELETE FROM \`settings\`;`);
    await queryRunner.query(`DELETE FROM \`banners\`;`);
    await queryRunner.query(`DELETE FROM \`contacts\`;`);
    await queryRunner.query(`DELETE FROM \`notifications\`;`);
    await queryRunner.query(`DELETE FROM \`reviews\`;`);
    await queryRunner.query(`DELETE FROM \`payments\`;`);
    await queryRunner.query(`DELETE FROM \`order_items\`;`);
    await queryRunner.query(`DELETE FROM \`orders\`;`);
    await queryRunner.query(`DELETE FROM \`coupons\`;`);
    await queryRunner.query(`DELETE FROM \`cart_items\`;`);
    await queryRunner.query(`DELETE FROM \`carts\`;`);
    await queryRunner.query(`DELETE FROM \`addresses\`;`);
    await queryRunner.query(`DELETE FROM \`product_images\`;`);
    await queryRunner.query(`DELETE FROM \`products\`;`);
    await queryRunner.query(`DELETE FROM \`categories\`;`);
    await queryRunner.query(`DELETE FROM \`users\`;`);
    await queryRunner.query(`DELETE FROM \`roles\`;`);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }
}
