import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-stone-950 text-white">
      <div className="section-wrap py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">☕ CoffeeShop</h3>
            <p className="text-stone-300 leading-7">
              Cà phê chất lượng cao, được chọn lọc từ những vùng canh tác tốt nhất thế giới.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              <li><button type="button" className="text-left text-stone-300 transition hover:text-white">Về Chúng Tôi</button></li>
              <li><button type="button" className="text-left text-stone-300 transition hover:text-white">Điều Khoản</button></li>
              <li><button type="button" className="text-left text-stone-300 transition hover:text-white">Chính Sách Bảo Mật</button></li>
              <li><button type="button" className="text-left text-stone-300 transition hover:text-white">Liên Hệ</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>123 Đường Café, Thành Phố</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>info@coffeeshop.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Theo Dõi</h3>
            <div className="flex space-x-4">
              <button type="button" className="rounded-full border border-white/10 p-2 text-stone-300 transition hover:border-amber-300 hover:text-white">
                <Facebook size={24} />
              </button>
              <button type="button" className="rounded-full border border-white/10 p-2 text-stone-300 transition hover:border-amber-300 hover:text-white">
                <Instagram size={24} />
              </button>
              <button type="button" className="rounded-full border border-white/10 p-2 text-stone-300 transition hover:border-amber-300 hover:text-white">
                <Twitter size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-stone-400">
          <p>&copy; 2024 CoffeeShop. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
