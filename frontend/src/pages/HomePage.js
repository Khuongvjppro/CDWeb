import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Leaf, Award, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { productAPI } from "../utils/api";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const { addToCart } = useCart();

  const slides = [
    {
      id: 1,
      tag: "New arrival",
      title: "Matcha Dâu",
      subtitle:
        "Vị ngọt nhẹ, lớp kem mượt và cảm giác chill theo kiểu café Nhật/Hàn.",
      accent: "from-[#e7d8c9] via-[#f2e4d8] to-[#b55239]",
      cupLeft: "bg-gradient-to-b from-[#e7d8c9] to-[#b55239]",
      cupRight: "bg-gradient-to-b from-[#fff8f2] to-[#e7d8c9]",
      badgeLeft: "Matcha Dâu",
      badgeRight: "Fresh Pick",
    },
    {
      id: 2,
      tag: "Signature",
      title: "Hạnh Nhân",
      subtitle:
        "Hương hạt rang dịu, lớp kem đậm và phong vị cân bằng đầy nghệ.",
      accent: "from-[#f3e6d9] via-[#e7d8c9] to-[#5a3e36]",
      cupLeft: "bg-gradient-to-b from-[#e7d8c9] to-[#5a3e36]",
      cupRight: "bg-gradient-to-b from-[#5a3e36] to-[#b55239]",
      badgeLeft: "Hạnh Nhân",
      badgeRight: "Best seller",
    },
    {
      id: 3,
      tag: "Limited",
      title: "Phin Đậm",
      subtitle:
        "Một ly cà phê đậm vị, ấm và rõ hậu vị — đúng vibe Instagram aesthetic.",
      accent: "from-[#fff8f2] via-[#e7d8c9] to-[#b55239]",
      cupLeft: "bg-gradient-to-b from-[#fff8f2] to-[#b55239]",
      cupRight: "bg-gradient-to-b from-[#5a3e36] to-[#e7d8c9]",
      badgeLeft: "Phin Đậm",
      badgeRight: "Classic",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setFeaturedProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="section-wrap pt-6 sm:pt-8">
          <div className="hero-panel relative min-h-[72vh] overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[activeSlide].accent} opacity-100`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_40%)]" />
            <div className="relative grid min-h-[72vh] items-center gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-12">
              <div className="max-w-2xl text-stone-950">
                <span className="section-kicker border-white/40 bg-white/70 text-[#5a3e36]">
                  {slides[activeSlide].tag}
                </span>
                <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] sm:text-7xl">
                  {slides[activeSlide].title}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/90 sm:text-xl">
                  {slides[activeSlide].subtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/products" className="btn-primary text-white">
                    Khám Phá Sản Phẩm
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/register" className="btn-secondary">
                    Đăng Ký Thành Viên
                  </Link>
                </div>

                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center">
                  <div className="hero-stat bg-white/80 text-[#5a3e36]">
                    <div className="text-2xl font-extrabold text-[#b55239]">6+</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7a665f]">
                      Món nổi bật
                    </div>
                  </div>
                  <div className="hero-stat bg-white/80 text-[#5a3e36]">
                    <div className="text-2xl font-extrabold text-[#b55239]">24h</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7a665f]">
                      Rang mới
                    </div>
                  </div>
                  <div className="hero-stat bg-white/80 text-[#5a3e36]">
                    <div className="text-2xl font-extrabold text-[#b55239]">4.9</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7a665f]">
                      Đánh giá
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition hover:bg-white/30"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-10 bg-white" : "w-2.5 bg-white/50"}`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition hover:bg-white/30"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute left-0 top-8 hidden rounded-full bg-[#5a3e36]/90 px-4 py-2 text-sm font-semibold text-white shadow-lg lg:block">
                  {slides[activeSlide].badgeLeft}
                </div>
                <div className="absolute right-0 top-16 hidden rounded-full bg-[#e7d8c9]/90 px-4 py-2 text-sm font-semibold text-[#5a3e36] shadow-lg lg:block">
                  {slides[activeSlide].badgeRight}
                </div>

                <div className="relative grid w-full max-w-2xl grid-cols-2 gap-5">
                  <div className="hero-panel-soft flex min-h-[34rem] items-end justify-center overflow-hidden p-4 sm:p-6">
                    <div className={`h-[22rem] w-[14rem] rounded-[3rem] ${slides[activeSlide].cupLeft} shadow-[0_30px_80px_rgba(0,0,0,0.18)]`} />
                  </div>
                  <div className="hero-panel-soft flex min-h-[34rem] items-end justify-center overflow-hidden p-4 sm:p-6">
                    <div className={`h-[22rem] w-[14rem] rounded-[3rem] ${slides[activeSlide].cupRight} shadow-[0_30px_80px_rgba(0,0,0,0.18)]`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap pt-0">
          <div className="section-heading">
            <span className="eyebrow">Why us</span>
            <h2 className="title-xl">
              Thiết kế tập trung vào cảm giác cao cấp
            </h2>
            <p className="muted-copy">
              Mỗi khối UI đều có khoảng thở, độ tương phản tốt và viền mềm để
              tạo cảm giác hiện đại, sang và dễ đọc trên desktop lẫn mobile.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="surface-card-soft p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7d8c9] text-[#b55239]">
                <Zap size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">
                Tươi ngay mỗi ngày
              </h3>
              <p className="mt-3 leading-7 text-stone-600">
                Tông màu ấm, shadow mềm và layout thoáng giúp nội dung không bị
                “đè” lên nhau.
              </p>
            </div>
            <div className="surface-card-soft p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e6d9] text-[#5a3e36]">
                <Leaf size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">
                Tự nhiên, tinh gọn
              </h3>
              <p className="mt-3 leading-7 text-stone-600">
                Các component được chuẩn hóa để mọi màn hình đều có cùng nhịp
                điệu thị giác.
              </p>
            </div>
            <div className="surface-card-soft p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7d8c9] text-[#b55239]">
                <Award size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">
                Đúng chuẩn storefront
              </h3>
              <p className="mt-3 leading-7 text-stone-600">
                Hình khối bo tròn, CTA rõ, và tiêu đề lớn để tạo cảm giác thương
                hiệu thực sự.
              </p>
            </div>
          </div>
        </section>

        <section className="section-wrap pt-0">
          <div className="section-heading flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Featured</span>
              <h2 className="title-xl">Sản phẩm nổi bật</h2>
            </div>
            <Link
              to="/products"
              className="hidden btn-secondary md:inline-flex"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </section>

        <section className="section-wrap pt-0 pb-20">
          <div className="surface-card overflow-hidden bg-[#5a3e36] px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="eyebrow border-white/10 bg-white/5 text-[#f3e6d9]">
                  Newsletter
                </span>
                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                  Nhận ưu đãi đặc biệt và bộ sưu tập mới
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-stone-300">
                  Một khu vực đăng ký gọn gàng, sáng rõ và đủ tương phản để tạo
                  cảm giác premium thay vì biểu mẫu cũ kỹ.
                </p>
              </div>
              <div className="surface-card-soft bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="input-field-dark flex-1"
                  />
                  <button className="btn-primary whitespace-nowrap">
                    Đăng Ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
