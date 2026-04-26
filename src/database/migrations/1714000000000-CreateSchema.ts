import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1714000000000 implements MigrationInterface {
  name = 'CreateSchema1714000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await queryRunner.query(`
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL DEFAULT 3,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULL,
    status ENUM('active', 'locked', 'inactive') NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    description TEXT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_parent_id FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    sku VARCHAR(80) NOT NULL UNIQUE,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(15,2) NULL,
    quantity INT NOT NULL DEFAULT 0,
    short_description VARCHAR(500) NULL,
    description TEXT NULL,
    thumbnail VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'out_of_stock') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_images_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    address_detail VARCHAR(255) NOT NULL,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE carts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_cart_id FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product_id FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percent', 'fixed', 'free_shipping') NOT NULL,
    value DECIMAL(15,2) NOT NULL DEFAULT 0,
    min_order_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    max_discount_amount DECIMAL(15,2) NULL,
    usage_limit INT NULL,
    used_count INT NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'expired') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    coupon_id BIGINT UNSIGNED NULL,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150) NULL,
    shipping_address VARCHAR(500) NOT NULL,
    note TEXT NULL,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    payment_method ENUM('cod', 'bank_transfer', 'vnpay', 'momo', 'paypal') NOT NULL DEFAULT 'cod',
    payment_status ENUM('unpaid', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'unpaid',
    order_status ENUM('pending', 'confirmed', 'preparing', 'shipping', 'completed', 'cancelled', 'returned') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_orders_coupon_id FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(255) NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order_id FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL UNIQUE,
    payment_method ENUM('cod', 'bank_transfer', 'vnpay', 'momo', 'paypal') NOT NULL,
    transaction_code VARCHAR(100) NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM('unpaid', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'unpaid',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order_id FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT NULL,
    status ENUM('visible', 'hidden', 'pending') NOT NULL DEFAULT 'visible',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_order_id FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_review_once UNIQUE (user_id, product_id, order_id)
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'payment', 'system', 'inventory', 'promotion') NOT NULL DEFAULT 'system',
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE contacts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    subject VARCHAR(200) NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'processing', 'replied', 'closed') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NULL,
    position VARCHAR(50) NOT NULL DEFAULT 'home_top',
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
CREATE TABLE inventory_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    type ENUM('import', 'export', 'adjustment', 'return') NOT NULL,
    quantity INT NOT NULL,
    note VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_logs_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_logs_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
    `);

    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`inventory_logs\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`settings\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`banners\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`contacts\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`notifications\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`reviews\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`payments\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order_items\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`orders\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`coupons\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`cart_items\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`carts\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`addresses\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_images\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`products\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`categories\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`roles\`;`);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }
}
