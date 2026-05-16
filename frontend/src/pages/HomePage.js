import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Leaf, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI } from '../utils/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setFeaturedProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="section-wrap pt-10 sm:pt-14">
          <div className="surface-card overflow-hidden border-amber-100/60">
            <div className="grid items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:px-12 lg:py-14">
              <div className="max-w-2xl">
                <span className="eyebrow">Roasted daily • Crafted in-house</span>
                <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight text-stone-950 sm:text-6xl">
                  Cà phê ngon, giao diện đẹp và trải nghiệm mua sắm sang hơn.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
                  CoffeeShop được thiết kế như một cửa hàng hiện đại: tinh gọn, nhiều khoảng thở, màu sắc ấm áp và tập trung vào sản phẩm.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/products" className="btn-primary">
                    Khám Phá Sản Phẩm
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/products" className="btn-secondary">
                    Xem Bộ Sưu Tập
                  </Link>
                </div>
                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-stone-900 px-4 py-4 text-white shadow-lg shadow-stone-900/10">
                    <div className="text-2xl font-extrabold">6+</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-300">Món nổi bật</div>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-4 shadow-md shadow-stone-900/5">
                    <div className="text-2xl font-extrabold text-amber-800">24h</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">Rang mới</div>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-4 shadow-md shadow-stone-900/5">
                    <div className="text-2xl font-extrabold text-amber-800">4.9</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">Đánh giá</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-10 hidden rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-lg shadow-amber-900/5 lg:block">
                  Cà phê đặc sản
                </div>
                <div className="surface-card-soft relative overflow-hidden p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_55%)]" />
                  <div className="relative grid grid-cols-2 gap-4">
                    <div className="surface-card-soft bg-white/90 p-5 text-center">
                      <div className="text-5xl">☕</div>
                      <div className="mt-4 text-sm font-semibold text-stone-600">Espresso</div>
                    </div>
                    <div className="surface-card-soft bg-stone-950 p-5 text-center text-white">
                      <div className="text-5xl">🥛</div>
                      <div className="mt-4 text-sm font-semibold text-stone-200">Cà Phê Sữa</div>
                    </div>
                    <div className="surface-card-soft bg-amber-600 p-5 text-center text-white">
                      <div className="text-5xl">🍫</div>
                      <div className="mt-4 text-sm font-semibold text-white/90">Mocha</div>
                    </div>
                    <div className="surface-card-soft bg-white/90 p-5 text-center">
                      <div className="text-5xl">❄️</div>
                      <div className="mt-4 text-sm font-semibold text-stone-600">Cold Brew</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap pt-0">
          <div className="section-heading">
            <span className="eyebrow">Why us</span>
            <h2 className="title-xl">Thiết kế tập trung vào cảm giác cao cấp</h2>
            <p className="muted-copy">Mỗi khối UI đều có khoảng thở, độ tương phản tốt và viền mềm để tạo cảm giác hiện đại, sang và dễ đọc trên desktop lẫn mobile.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="surface-card-soft p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <Zap size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">Tươi ngay mỗi ngày</h3>
              <p className="mt-3 leading-7 text-stone-600">Tông màu ấm, shadow mềm và layout thoáng giúp nội dung không bị “đè” lên nhau.</p>
            </div>
            <div className="surface-card-soft p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Leaf size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">Tự nhiên, tinh gọn</h3>
              <p className="mt-3 leading-7 text-stone-600">Các component được chuẩn hóa để mọi màn hình đều có cùng nhịp điệu thị giác.</p>
            </div>
            <div className="surface-card-soft p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <Award size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">Đúng chuẩn storefront</h3>
              <p className="mt-3 leading-7 text-stone-600">Hình khối bo tròn, CTA rõ, và tiêu đề lớn để tạo cảm giác thương hiệu thực sự.</p>
            </div>
          </div>
        </section>

        <section className="section-wrap pt-0">
          <div className="section-heading flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Featured</span>
              <h2 className="title-xl">Sản phẩm nổi bật</h2>
            </div>
            <Link to="/products" className="hidden btn-secondary md:inline-flex">
              Xem tất cả
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        <section className="section-wrap pt-0 pb-20">
          <div className="surface-card overflow-hidden bg-stone-950 px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="eyebrow border-white/10 bg-white/5 text-amber-100">Newsletter</span>
                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Nhận ưu đãi đặc biệt và bộ sưu tập mới</h2>
                <p className="mt-4 max-w-2xl leading-7 text-stone-300">Một khu vực đăng ký gọn gàng, sáng rõ và đủ tương phản để tạo cảm giác premium thay vì biểu mẫu cũ kỹ.</p>
              </div>
              <div className="surface-card-soft bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input type="email" placeholder="Nhập email của bạn" className="input-field-dark flex-1" />
                  <button className="btn-primary whitespace-nowrap">Đăng Ký</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
