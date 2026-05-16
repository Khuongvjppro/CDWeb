# CoffeeShop E-Commerce Project

Dự án bán cà phê chuyên nghiệp với cấu trúc hoàn chỉnh (Backend, Frontend, Admin)

## 📁 Cấu Trúc Dự Án

```
CDWeb/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── server.js
│   │   ├── config/       # Database config
│   │   ├── models/       # Database models
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Auth middleware
│   └── package.json
│
├── frontend/             # React App (User)
│   ├── src/
│   │   ├── pages/        # Pages (Home, Products, Cart, etc)
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Cart & Auth context
│   │   └── utils/        # API utilities
│   └── package.json
│
├── admin/                # React Admin Dashboard
│   ├── src/
│   │   ├── pages/        # Dashboard, Products, Orders, Users
│   │   ├── components/   # Sidebar
│   │   └── context/      # Auth context
│   └── package.json
│
└── database/             # MySQL Database
    ├── coffee_shop.sql   # Database schema & sample data
    └── README.md
```

## 🚀 Cài Đặt & Chạy Dự Án

### 1. Thiết lập Database (XAMPP MySQL)

```bash
# Mở phpMyAdmin: http://localhost/phpmyadmin
# Import file: database/coffee_shop.sql
# Hoặc chạy query trực tiếp
```

### 2. Chạy Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# Server chạy tại http://localhost:5000
```

### 3. Chạy Frontend (User)

```bash
cd frontend
npm install
npm start
# Mở http://localhost:3000
```

### 4. Chạy Admin Dashboard

```bash
cd admin
npm install
npm start
# Mở http://localhost:3001
```

## 🔐 Tài Khoản Demo

### Frontend
- Email: user@example.com
- Password: 123456

### Admin
- Email: admin@coffeeshop.com
- Password: admin123

## 📊 Tính Năng Chính

### Frontend (User)
- ☕ Trang chủ với sản phẩm nổi bật
- 🛍️ Danh sách sản phẩm với bộ lọc & tìm kiếm
- 📝 Chi tiết sản phẩm
- 🛒 Giỏ hàng
- 💳 Checkout & thanh toán
- 👤 Quản lý đơn hàng
- 🔐 Đăng nhập/Đăng ký

### Admin
- 📊 Bảng điều khiển với thống kê
- 📦 Quản lý sản phẩm (CRUD)
- 📋 Quản lý đơn hàng
- 👥 Quản lý khách hàng
- 📈 Biểu đồ doanh thu

## 🎨 UI/UX

- **Framework**: Tailwind CSS + Lucide Icons
- **Màu sắc**: Brown/Amber theme (phù hợp cà phê)
- **Responsive**: Mobile, Tablet, Desktop
- **Modern**: Gradient, Shadow, Hover effects

## 🔧 Công Nghệ Sử Dụng

**Backend**
- Node.js + Express.js
- MySQL (XAMPP)
- JWT Authentication
- bcryptjs (Password hashing)

**Frontend**
- React 18
- React Router v6
- Axios (API calls)
- Tailwind CSS
- Lucide React Icons
- Context API (State management)

**Database**
- MySQL
- XAMPP

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/category/:category` - Theo danh mục
- `GET /api/products/search?keyword=` - Tìm kiếm

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/user` - Đơn hàng của user
- `GET /api/orders/:id` - Chi tiết đơn hàng

## 📱 Mobile Responsive

- ✅ Mobile first design
- ✅ Touch-friendly buttons
- ✅ Mobile menu navigation
- ✅ Responsive grid layout

## 🎯 Hướng Phát Triển

- [ ] Payment gateway (Stripe, Momo)
- [ ] Email notifications
- [ ] Product reviews & ratings
- [ ] Promotion codes
- [ ] Inventory management
- [ ] Order tracking with map
- [ ] Customer analytics
- [ ] Multi-language support

## 📄 License

MIT License

---

**Made with ❤️ for CoffeeShop**
