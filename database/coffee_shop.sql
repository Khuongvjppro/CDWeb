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
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  stock INT DEFAULT 0,
  deleted TINYINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  upderedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(name)
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

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Cà Phê Đen', 'Cà phê đen đậm đà'),
('Cà Phê Sữa', 'Cà phê với sữa mịn mọng'),
('Espresso', 'Cà phê Espresso nguyên chất'),
('Cappuccino', 'Cà phê Cappuccino ý'),
('Latte', 'Cà phê Latte mềm mại'),
('Mocha', 'Cà phê Mocha với sô cô la');

-- Insert sample products
INSERT INTO products (name, description, price, image, category, stock) VALUES
('Cà Phê Đen Đắng', 'Cà phê đen 100% nguyên chất, hương vị đậm đà', 35000, '/images/coffee1.jpg', 'Cà Phê Đen', 50),
('Cà Phê Sữa Tươi', 'Cà phê sữa tươi ngon tuyệt vời', 45000, '/images/coffee2.jpg', 'Cà Phê Sữa', 40),
('Espresso Chuẩn Ý', 'Espresso nhập khẩu từ Ý', 55000, '/images/coffee3.jpg', 'Espresso', 35),
('Cappuccino Nóng', 'Cappuccino pha chế theo cách truyền thống', 50000, '/images/coffee4.jpg', 'Cappuccino', 45),
('Latte Mượt Mà', 'Latte với tỷ lệ cà phê sữa hoàn hảo', 48000, '/images/coffee5.jpg', 'Latte', 42),
('Mocha Socola', 'Mocha kết hợp cà phê và socola thượng hạng', 52000, '/images/coffee6.jpg', 'Mocha', 38);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_order_user ON orders(userId);
CREATE INDEX idx_order_status ON orders(status);
