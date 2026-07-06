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
  Folder
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
    { label: "Khách hàng", to: "/admin/users", icon: <Users size={16} /> },
  ];

  return (
    <header className="bg-[#5a3e36] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="font-black tracking-wider uppercase text-sm sm:text-base">CoffeeShop Admin</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive 
                      ? "bg-[#b55239] text-white shadow-sm" 
                      : "text-[#f3e6d9] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
      
      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden bg-[#4e342e] border-t border-white/5 py-1 px-4 flex justify-around">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold transition ${
                isActive ? "text-[#e7d8c9]" : "text-[#bcaaa4]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
