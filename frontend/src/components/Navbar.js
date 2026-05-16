import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Menu, X, LogOut, ChevronRight, BadgeInfo } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(88,46,18,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 rounded-full bg-stone-900 px-4 py-2 text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5">
            <span className="text-2xl">☕</span>
            <div className="hidden sm:block">
              <div className="text-[11px] uppercase tracking-[0.22em] text-amber-200/80">Premium Coffee</div>
              <div className="text-lg font-bold leading-tight">CoffeeShop</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/70 bg-white/80 p-2 shadow-lg shadow-stone-900/5 backdrop-blur">
            <Link to="/" className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-900">
              Trang Chủ
            </Link>
            <Link to="/products" className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-900">
              Sản Phẩm
            </Link>
            <Link to="/cart" className="relative rounded-full px-4 py-2 text-stone-700 transition hover:bg-amber-50 hover:text-amber-900">
              <span className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span className="text-sm font-medium">Giỏ hàng</span>
              </span>
              {getTotalItems() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[11px] font-bold text-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {isAuthenticated() ? (
              <div className="flex items-center gap-2 pl-2">
                <Link to="/orders" className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-900">
                  Đơn Hàng
                </Link>
                <div className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700">
                  <BadgeInfo size={16} className="text-amber-700" />
                  <span className="max-w-[140px] truncate">{user?.fullName}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm text-red-700 hover:border-red-200 hover:text-red-800">
                  <LogOut size={16} />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-amber-50 hover:text-amber-900">
                  Đăng Nhập
                </Link>
                <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                  Đăng Ký
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-sm">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white/95 px-4 py-4 backdrop-blur-xl">
          <div className="surface-card-soft p-4">
            <div className="space-y-2">
              <Link to="/" className="block rounded-2xl px-4 py-3 text-stone-700 transition hover:bg-amber-50 hover:text-amber-900" onClick={() => setIsOpen(false)}>
                Trang Chủ
              </Link>
              <Link to="/products" className="block rounded-2xl px-4 py-3 text-stone-700 transition hover:bg-amber-50 hover:text-amber-900" onClick={() => setIsOpen(false)}>
                Sản Phẩm
              </Link>
              <Link to="/cart" className="block rounded-2xl px-4 py-3 text-stone-700 transition hover:bg-amber-50 hover:text-amber-900" onClick={() => setIsOpen(false)}>
                Giỏ Hàng ({getTotalItems()})
              </Link>
              {isAuthenticated() ? (
                <>
                  <Link to="/orders" className="block rounded-2xl px-4 py-3 text-stone-700 transition hover:bg-amber-50 hover:text-amber-900" onClick={() => setIsOpen(false)}>
                    Đơn Hàng
                  </Link>
                  <button onClick={handleLogout} className="btn-primary mt-2 w-full">
                    <LogOut size={16} />
                    <span>Đăng Xuất</span>
                  </button>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link to="/login" className="btn-secondary" onClick={() => setIsOpen(false)}>
                    Đăng Nhập
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={() => setIsOpen(false)}>
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
