import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Bảng Điều Khiển" },
    { path: "/products", icon: Box, label: "Sản Phẩm" },
    { path: "/orders", icon: ShoppingCart, label: "Đơn Hàng" },
    { path: "/users", icon: Users, label: "Khách Hàng" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-amber-900 to-amber-800 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-amber-700">
        <h1 className="text-2xl font-bold">☕ Admin</h1>
        <p className="text-xs text-amber-200">CoffeeShop Management</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-amber-700 text-white"
                  : "text-amber-100 hover:bg-amber-800"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-amber-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </div>
  );
}
