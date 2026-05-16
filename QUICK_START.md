# 📋 Quick Start - CoffeeShop Project

## ⚡ Cài Đặt Nhanh (5 phút)

### 1️⃣ Database (XAMPP)
```bash
# Mở phpMyAdmin: http://localhost/phpmyadmin
# Import: database/coffee_shop.sql
```

### 2️⃣ Backend
```bash
cd backend
npm install
npm run dev
# ✓ http://localhost:5000
```

### 3️⃣ Frontend (Terminal mới)
```bash
cd frontend
npm install
npm start
# ✓ http://localhost:3000
```

### 4️⃣ Admin (Terminal mới)
```bash
cd admin
npm install
npm start
# ✓ http://localhost:3001
```

---

## 🔐 Tài Khoản Demo

| Loại | Email | Password |
|------|-------|----------|
| User | user@example.com | 123456 |
| Admin | admin@coffeeshop.com | admin123 |

---

## 🎨 Các Tính Năng Chính

### 👥 Frontend (Khách Hàng)
✅ Trang chủ đẹp
✅ Danh sách & tìm kiếm sản phẩm
✅ Giỏ hàng + Checkout
✅ Quản lý tài khoản & đơn hàng
✅ Responsive design

### 🛠️ Admin (Quản Lý)
✅ Dashboard thống kê
✅ Quản lý sản phẩm
✅ Quản lý đơn hàng
✅ Quản lý khách hàng

### 🔌 API (Backend)
✅ Authentication (JWT)
✅ CRUD Products
✅ CRUD Orders
✅ User Management

### 💾 Database (MySQL)
✅ 5 bảng chính
✅ Dữ liệu mẫu
✅ Indexes optimize

---

## 📱 Giao Diện

- **Màu sắc**: Brown/Amber (cà phê)
- **Icons**: Lucide React
- **CSS**: Tailwind CSS
- **Responsive**: Mobile ✓ Tablet ✓ Desktop ✓

---

## 🔄 Flow Ứng Dụng

```
User (Frontend)
    ↓
    → Xem sản phẩm
    → Thêm giỏ hàng
    → Thanh toán
    → Xem đơn hàng
    ↓
API (Backend)
    ↓
Database (MySQL)
    ↓
Admin (Quản lý)
    ↓
    → Xem thống kê
    → Quản lý sản phẩm
    → Xử lý đơn hàng
```

---

## 🚨 Troubleshooting

**Cannot connect MySQL?**
→ Bật XAMPP MySQL

**Port đã dùng?**
→ Đóng ứng dụng khác hoặc dùng port khác

**npm install lâu?**
→ Chạy `npm install --legacy-peer-deps`

**API không gọi được?**
→ Kiểm tra backend chạy ở port 5000

---

## 📞 Cần Chi Tiết?
Xem: `HUONG_DAN_CAI_DAT.md` hoặc `README.md`

**Happy Coding! ☕**
