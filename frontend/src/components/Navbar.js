import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCircle,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  const authLinks = useMemo(() => {
    if (isAuthenticated()) {
      return [
        { label: "Đơn hàng", to: "/orders" },
        { label: "Giỏ hàng", to: "/cart" },
      ];
    }

    return [
      { label: "Đăng nhập", to: "/login" },
      { label: "Đăng ký", to: "/register" },
    ];
  }, [isAuthenticated]);

  const renderUserDropdown = () => {
    if (isAuthenticated()) {
      return (
        <div className="min-w-[240px] rounded-[1.5rem] border border-white/10 bg-[#5a3e36] p-3 text-white shadow-[0_24px_60px_rgba(20,12,8,0.3)]">
          <div className="rounded-2xl bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7d8c9] text-[#5a3e36]">
                <UserCircle size={22} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#e7d8c9]/80">
                  Xin chào
                </div>
                <div className="font-semibold">{user?.fullName}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {authLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setUserMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#fff8f2] transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#f3e6d9] transition hover:bg-white/10"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-w-[220px] rounded-[1.5rem] border border-white/10 bg-[#5a3e36] p-3 text-white shadow-[0_24px_60px_rgba(20,12,8,0.3)]">
        <Link
          to="/login"
          onClick={() => setUserMenuOpen(false)}
          className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#fff8f2] transition hover:bg-white/10"
        >
          Đăng nhập
        </Link>
        <Link
          to="/register"
          onClick={() => setUserMenuOpen(false)}
          className="mt-1 block rounded-2xl bg-[#b55239] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a34733]"
        >
          Đăng ký
        </Link>
      </div>
    );
  };

  if (isAuthRoute) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#7b1e2b] text-white shadow-[0_12px_40px_rgba(61,15,22,0.34)] backdrop-blur-xl">
      <div className="top-strip border-b border-white/10 bg-[rgba(90,22,31,0.42)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e7d8c9]/90 sm:px-6 lg:px-8">
          <span>Đặt trước • Giao nhanh • Thưởng thức tại nhà</span>
          <span className="hidden sm:inline">Highlands-inspired coffee experience</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-[1.15fr_auto_1.15fr] items-center gap-4">
          <div className="hidden items-center justify-start gap-2 md:flex">
            <Link to="/products" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
              Thực đơn
            </Link>
            <Link
              to="/about-highlands"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Về Highlands
            </Link>
            <Link
              to="/news"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Tin tức
            </Link>
            <Link
              to="/support"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Hỗ trợ
            </Link>
          </div>

          <Link to="/" className="flex items-center justify-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl text-white shadow-lg shadow-black/10">
              ☕
            </span>
            <div className="text-center leading-tight">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#e7d8c9]/90">
                Highlands style
              </div>
              <div className="text-xl font-black uppercase tracking-[0.08em] text-white">
                CoffeeShop
              </div>
            </div>
          </Link>

          <div className="relative flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <UserCircle size={20} />
              <span className="hidden sm:inline">Tài khoản</span>
              <ChevronDown size={16} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50">
                {renderUserDropdown()}
              </div>
            )}

            <Link to="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15">
              <ShoppingCart size={18} />
              {getTotalItems() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e7d8c9] px-1 text-[11px] font-bold text-[#5a3e36]">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen((value) => !value)}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white shadow-sm"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[rgba(24,12,8,0.96)] px-4 py-4 backdrop-blur-xl">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-white shadow-lg shadow-black/10">
            <div className="space-y-2">
              <Link
                to="/products"
                className="block rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Thực đơn
              </Link>
              <Link
                to="/about-highlands"
                className="block rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Về Highlands
              </Link>
              <Link
                to="/news"
                className="block rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Tin tức
              </Link>
              <Link
                to="/support"
                className="block rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Hỗ trợ
              </Link>
              <Link
                to="/cart"
                className="block rounded-2xl px-4 py-3 text-white transition hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Giỏ Hàng ({getTotalItems()})
              </Link>
              {isAuthenticated() ? (
                <button onClick={handleLogout} className="btn-primary mt-2 w-full">
                  <LogOut size={16} />
                  <span>Đăng Xuất</span>
                </button>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="btn-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Đăng Ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
