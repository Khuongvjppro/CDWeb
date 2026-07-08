import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Coffee, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Store,
  Folder,
  MessageSquare
} from "lucide-react";

export default function AdminNavbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard size={16} /> },
    { label: "Danh mục", to: "/admin/categories", icon: <Folder size={16} /> },
    { label: "Sản phẩm", to: "/admin/products", icon: <Coffee size={16} /> },
    { label: "Đơn hàng", to: "/admin/orders", icon: <ShoppingBag size={16} /> },
    { label: "Đánh giá", to: "/admin/reviews", icon: <MessageSquare size={16} /> },
    { label: "Khách hàng", to: "/admin/users", icon: <Users size={16} /> },
  ];

  return (
    <header className="bg-[#5a3e36] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center">
          
          {/* Centered Logo/Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              title="Về trang quản trị"
            >
              <span className="font-black tracking-wider uppercase text-sm sm:text-base">The Coffee Shop</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 z-20">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-[#f3e6d9] hover:bg-white/15 hover:text-white transition"
              title="Về trang cửa hàng"
            >
              <Store size={14} />
              <span className="hidden sm:inline">Về cửa hàng</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#b55239]/80 text-white hover:bg-[#b55239] transition"
              title="Đăng xuất"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
