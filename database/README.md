# Coffee Shop E-Commerce Database

## Cấu trúc CSDL

### 1. Bảng Users

- Lưu thông tin người dùng và admin
- Các trường: id, email, password, fullName, phone, address, role, timestamps

### 2. Bảng Categories

- Lưu các danh mục cà phê
- Các loại: Cà Phê Đen, Cà Phê Sữa, Espresso, Cappuccino, Latte, Mocha

### 3. Bảng Products

- Lưu thông tin sản phẩm cà phê
- Các trường: id, name, description, price, image, category, stock, deleted

### 4. Bảng Orders

- Lưu thông tin đơn hàng
- Trạng thái: pending, processing, shipped, delivered, cancelled

### 5. Bảng Order Items

- Lưu chi tiết sản phẩm trong mỗi đơn hàng
- Liên kết order và product

## Cách import database

1. Mở XAMPP Control Panel
2. Khởi động Apache và MySQL
3. Truy cập phpMyAdmin tại http://localhost/phpmyadmin
4. Chọn Import → Chọn file coffee_shop.sql
5. Click Go để import
