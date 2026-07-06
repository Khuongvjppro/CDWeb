import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[linear-gradient(180deg,#7b1e2b,#5a3e36)] text-white">
      <div className="section-wrap py-6 sm:py-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between lg:gap-12">
          <div className="p-4 md:w-5/12">
            <div className="brand-badge-soft w-fit bg-white/10 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7d8c9] text-[#7b1e2b]">
                ☕
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-[#e7d8c9]/80">
                  Coffee House
                </div>
                <div className="text-lg font-extrabold">CoffeeShop</div>
              </div>
            </div>
            <p className="mt-4 max-w-md leading-6 text-[#f3e6d9]/90">
              Khơi dậy niềm đam mê với những hạt cà phê rang xay nguyên chất. Chúng tôi cam kết mang đến những tách cà phê đậm đà bản sắc và một không gian thưởng thức khó quên.
            </p>
            <div className="mt-3 flex gap-3">
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#f3e6d9] transition hover:bg-white/15">
                <Facebook size={18} />
              </button>
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#f3e6d9] transition hover:bg-white/15">
                <Instagram size={18} />
              </button>
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#f3e6d9] transition hover:bg-white/15">
                <Twitter size={18} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-100/70">
              Liên Kết
            </h3>
            <ul className="mt-3 space-y-3 text-[#f3e6d9]">
              <li><Link to="/about-highlands" className="transition hover:text-white hover:underline">Về Chúng Tôi</Link></li>
              <li><Link to="/terms" className="transition hover:text-white hover:underline">Điều Khoản</Link></li>
              <li><Link to="/privacy" className="transition hover:text-white hover:underline">Chính Sách Bảo Mật</Link></li>
              <li><Link to="/support" className="transition hover:text-white hover:underline">Liên Hệ</Link></li>
            </ul>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-100/70">
              Liên Hệ
            </h3>
            <ul className="mt-3 space-y-2.5 text-[#f3e6d9]">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-[#e7d8c9]" />
                <span>123 Đường Café, Thành Phố</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#e7d8c9]" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#e7d8c9]" />
                <span>info@coffeeshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-3 text-center text-[#e7d8c9]/80">
          <p>&copy; 2024 CoffeeShop. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
