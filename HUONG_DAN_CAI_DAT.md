# 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án CoffeeShop

## Yêu Cầu Hệ Thống

- **Node.js**: v14+ 
- **npm**: v6+
- **XAMPP**: Chứa MySQL
- **VS Code**: Recommended

---

## BƯỚC 1: Thiết Lập Database (MySQL)

### 1.1 Khởi Động XAMPP

```bash
# Mở XAMPP Control Panel
# Khởi động Apache (tùy chọn)
# Khởi động MySQL ✓
```

### 1.2 Import Database

```
1. Mở trình duyệt: http://localhost/phpmyadmin
2. Tạo database mới (hoặc để trống, script sẽ tạo)
3. Chọn Import → Chọn file: database/coffee_shop.sql
4. Click Go ✓
```

### 1.3 Xác Nhận Database

```sql
-- Kiểm tra đã tạo table chưa
SHOW DATABASES;
USE coffee_shop;
SHOW TABLES;
```

---

## BƯỚC 2: Cài Đặt & Chạy BACKEND

### 2.1 Vào Thư Mục Backend

```bash
cd backend
```

### 2.2 Cài Đặt Dependencies

```bash
npm install
```

### 2.3 Cấu Hình Environment

```bash
# Copy file config
cp .env.example .env

# Kiểm tra .env file (đã có sẵn):
# PORT=5000
# MYSQL_HOST=localhost
# MYSQL_USER=root
# MYSQL_PASSWORD=    (để trống nếu chưa set password)
# MYSQL_DATABASE=coffee_shop
```

### 2.4 Chạy Backend Server

```bash
# Mode development (với auto-reload)
npm run dev

# Hoặc mode production
npm start

# ✓ Thấy "Server running on port 5000" là OK
```

### 2.5 Test Backend API

```bash
# Trong terminal khác, chạy:
curl http://localhost:5000/api/health

# Kết quả: {"message":"Server is running"}
```

---

## BƯỚC 3: Cài Đặt & Chạy FRONTEND (User)

### 3.1 Vào Thư Mục Frontend (Terminal mới)

```bash
cd frontend
```

### 3.2 Cài Đặt Dependencies

```bash
npm install

# ⚠️ Nếu lâu, bỏ qua và tiếp tục
```

### 3.3 Chạy Frontend

```bash
npm start

# Tự động mở browser tại http://localhost:3000
# ✓ Thấy trang chủ là OK
```

### 3.4 Đăng Nhập Test

```
Email: user@example.com
Password: 123456
```

---

## BƯỚC 4: Cài Đặt & Chạy ADMIN (Terminal mới)

### 4.1 Vào Thư Mục Admin

```bash
cd admin
```

### 4.2 Cài Đặt Dependencies

```bash
npm install
```

### 4.3 Chạy Admin

```bash
npm start

# Mở browser http://localhost:3001
# ✓ Thấy trang login admin là OK
```

### 4.4 Đăng Nhập Admin

```
Email: admin@coffeeshop.com
Password: admin123
```

---

## ✅ Kiểm Tra Toàn Bộ

Nếu tất cả chạy thành công, sẽ thấy:

```
✓ Backend:  http://localhost:5000  ← API Server
✓ Frontend: http://localhost:3000  ← User Website
✓ Admin:    http://localhost:3001  ← Admin Panel
✓ Database: MySQL Running
```

---

## 🎯 Tính Năng Để Test

### Frontend (User)
- [ ] Xem trang chủ
- [ ] Xem danh sách sản phẩm
- [ ] Tìm kiếm sản phẩm
- [ ] Lọc theo danh mục
- [ ] Xem chi tiết sản phẩm
- [ ] Thêm vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Đăng nhập/Đăng ký
- [ ] Thanh toán
- [ ] Xem lịch sử đơn hàng

### Admin
- [ ] Xem bảng điều khiển (Dashboard)
- [ ] Xem danh sách sản phẩm
- [ ] Thêm sản phẩm mới
- [ ] Sửa/Xóa sản phẩm
- [ ] Xem danh sách đơn hàng
- [ ] Cập nhật trạng thái đơn hàng
- [ ] Xem danh sách khách hàng

---

## 🐛 Khắc Phục Lỗi

### Lỗi: "Cannot connect to MySQL"
```bash
# Kiểm tra:
1. XAMPP MySQL đã bật?
2. .env file có đúng password?
3. Database đã import?

# Fix:
- Mở XAMPP → Bật MySQL
- Kiểm tra .env: MYSQL_PASSWORD=
```

### Lỗi: "Port 3000/3001 đã được sử dụng"
```bash
# Tìm process
lsof -i :3000

# Hoặc chạy trên port khác
PORT=3002 npm start
```

### Lỗi: "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: CORS Error
```
# Backend config đã cho phép CORS
# Kiểm tra backend chạy đúng port 5000
```

---

## 📚 Cấu Trúc Code

### Backend (Node.js)
```
src/
├── server.js           # Main entry point
├── config/
│   └── database.js     # MySQL connection
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
└── middleware/
    └── auth.js        # JWT authentication
```

### Frontend (React)
```
src/
├── pages/
│   ├── HomePage.js
│   ├── ProductsPage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   └── OrdersPage.js
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   └── ProductCard.js
├── context/
│   ├── CartContext.js
│   └── AuthContext.js
└── utils/
    └── api.js         # API service
```

### Admin (React)
```
src/
├── pages/
│   ├── DashboardPage.js
│   ├── ProductsPage.js
│   ├── OrdersPage.js
│   ├── UsersPage.js
│   └── LoginPage.js
├── components/
│   └── Sidebar.js
└── context/
    └── AuthContext.js
```

---

## 🚀 Lệnh Hữu Ích

### Backend
```bash
npm run dev      # Chạy với nodemon (auto-reload)
npm start        # Chạy production
```

### Frontend
```bash
npm start        # Chạy dev server
npm run build    # Build production
npm test         # Chạy test
```

---

## 📝 Ghi Chú

1. **Lần đầu chạy** có thể lâu (cài dependencies)
2. **Restart lại** nếu có thay đổi `.env`
3. **Mở 3 terminal** để chạy 3 phần (Backend, Frontend, Admin)
4. **Kiểm tra console** nếu gặp lỗi

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra lại từng bước
2. Xem console/terminal có lỗi gì
3. Đảm bảo port không bị trùng
4. Restart XAMPP MySQL

---

**Happy Coding! ☕**
