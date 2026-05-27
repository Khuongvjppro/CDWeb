import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Leaf, Award, ChevronLeft, ChevronRight } from "lucide-react";
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
      image: "/Image/matcha_dau.png",
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
      image: "/Image/coffee_hanhnhan.png",
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
      image: "/Image/bo.png",
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
        <section className="pt-0">
          <div className="relative min-h-[60vh] w-full overflow-hidden">
            <img
              src={slides[activeSlide].image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full overflow-hidden">
              <svg
                className="h-10 w-full"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0,30 C80,55 160,5 240,30 C320,55 400,5 480,30 C560,55 640,5 720,30 C800,55 880,5 960,30 C1040,55 1120,5 1200,30 C1280,55 1360,5 1440,30 L1440,0 L0,0 Z"
                  fill="#fdf6f0"
                />
              </svg>
            </div>

            <div className="relative mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6 py-16 text-center" />

            <div className="absolute inset-x-0 bottom-6 px-6">
              <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
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
