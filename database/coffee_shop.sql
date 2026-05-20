-- Coffee Shop E-commerce Database
-- Import this file into phpMyAdmin

CREATE DATABASE IF NOT EXISTS coffee_shop;
USE coffee_shop;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  upderedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  brand VARCHAR(100) DEFAULT 'Coffee Shop',
  size VARCHAR(50) DEFAULT 'M',
  product_type VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  is_featured TINYINT DEFAULT 0,
  is_new TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  totalAmount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shippingAddress TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  upderedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);

-- Create indexes
CREATE INDEX idx_product_category_id ON products(category_id);
CREATE INDEX idx_order_user ON orders(userId);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Cà phê', 'Các loại cà phê đen, cà phê sữa, espresso...'),
('Trà', 'Các loại trà đào, trà kem chese, trà trái cây...'),
('Freeze', 'Các loại đồ uống đá lạnh ngon tuyệt vời');

-- Insert sample products
INSERT INTO products (category_id, name, slug, description, brand, size, product_type, price, sale_price, image_url, stock, is_featured, is_new, created_at, updated_at) VALUES
-- Cà phê category (id = 1)
(1, 'Cà Phê Đen', 'ca-phe-den', 'Cà phê đen 100% nguyên chất, hương vị đậm đà', 'Coffee Shop', 'M', 'Cà phê đen', 35000, NULL, '/images/coffee1.jpg', 50, 0, 0, NOW(), NOW()),
(1, 'Cà Phê Sữa Tươi', 'ca-phe-sua-tuoi', 'Cà phê sữa tươi ngon tuyệt vời', 'Coffee Shop', 'M', 'Cà phê sữa', 45000, NULL, '/images/coffee2.jpg', 40, 0, 0, NOW(), NOW()),
(1, 'Espresso Chuẩn Ý', 'espresso-chuan-y', 'Espresso nhập khẩu từ Ý', 'Coffee Shop', 'M', 'Espresso', 55000, NULL, '/images/coffee3.jpg', 35, 0, 1, NOW(), NOW()),
(1, 'Cappuccino Nóng', 'cappuccino-nong', 'Cappuccino pha chế theo cách truyền thống', 'Coffee Shop', 'M', 'Cappuccino', 50000, 48000, '/images/coffee4.jpg', 45, 0, 0, NOW(), NOW()),
(1, 'Latte Mượt Mà', 'latte-muot-ma', 'Latte với tỷ lệ cà phê sữa hoàn hảo', 'Coffee Shop', 'M', 'Latte', 48000, NULL, '/images/coffee5.jpg', 42, 1, 0, NOW(), NOW()),
(1, 'Mocha Socola', 'mocha-socola', 'Mocha kết hợp cà phê và socola thượng hạng', 'Coffee Shop', 'M', 'Mocha', 52000, 49000, '/images/coffee6.jpg', 38, 0, 0, NOW(), NOW()),

-- Trà category (id = 2)
(2, 'Trà Đào Tươi', 'tra-dao-tuoi', 'Trà đào tươi mát, thanh mát dễ chịu', 'Coffee Shop', 'M', 'Trà đào', 40000, NULL, '/images/tea1.jpg', 45, 0, 0, NOW(), NOW()),
(2, 'Trà Đào Kem Chese', 'tra-dao-kem-chese', 'Trà đào kết hợp kem chese béo ngậy', 'Coffee Shop', 'M', 'Trà đào kem chese', 48000, NULL, '/images/tea2.jpg', 50, 0, 1, NOW(), NOW()),
(2, 'Trà Ô Long Đậm', 'tra-o-long-dam', 'Trà ô long truyền thống hương thơm', 'Coffee Shop', 'M', 'Trà ô long', 42000, NULL, '/images/tea3.jpg', 35, 0, 0, NOW(), NOW()),
(2, 'Trà Xanh Chanh', 'tra-xanh-chanh', 'Trà xanh tươi kết hợp chanh tự nhiên', 'Coffee Shop', 'M', 'Trà xanh', 38000, NULL, '/images/tea4.jpg', 55, 1, 0, NOW(), NOW()),
(2, 'Trà Hồng Nhài', 'tra-hong-nhai', 'Trà hồng với hương hoa nhài duyên dáng', 'Coffee Shop', 'M', 'Trà hồng', 44000, 42000, '/images/tea5.jpg', 30, 0, 0, NOW(), NOW()),

-- Freeze category (id = 3)
(3, 'Freeze Cà Phê', 'freeze-ca-phe', 'Cà phê đá lạnh mát, đậm đà lạnh giá', 'Coffee Shop', 'M', 'Freeze cà phê', 40000, NULL, '/images/freeze1.jpg', 60, 0, 0, NOW(), NOW()),
(3, 'Freeze Trà Đào', 'freeze-tra-dao', 'Trà đào đá lạnh mát mẻ', 'Coffee Shop', 'M', 'Freeze trà đào', 42000, NULL, '/images/freeze2.jpg', 50, 0, 0, NOW(), NOW()),
(3, 'Freeze Sô Cô La', 'freeze-so-co-la', 'Sô cô la đá vừa lạnh vừa ngọt ngào', 'Coffee Shop', 'M', 'Freeze sô cô la', 45000, NULL, '/images/freeze3.jpg', 35, 0, 1, NOW(), NOW()),
(3, 'Freeze Kem Cà Phê', 'freeze-kem-ca-phe', 'Freeze cà phê kết hợp kem tươi', 'Coffee Shop', 'M', 'Freeze kem cà phê', 48000, 46000, '/images/freeze4.jpg', 40, 0, 0, NOW(), NOW()),
(3, 'Freeze Trà Xanh', 'freeze-tra-xanh', 'Freeze trà xanh lạnh mát sảng khoái', 'Coffee Shop', 'M', 'Freeze trà xanh', 42000, NULL, '/images/freeze5.jpg', 45, 1, 0, NOW(), NOW());

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_status ON orders(status);
