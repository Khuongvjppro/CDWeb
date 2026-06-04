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

        <section className="section-wrap">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow mx-auto">Hành trình hương vị</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#5a3e36] sm:text-5xl leading-tight">
              Tâm Huyết Trong Từng Giọt Cà Phê
            </h2>
            <p className="mt-4 text-base text-[#7a665f] sm:text-lg">
              Từ nông trại xanh mướt Buôn Ma Thuột đến ly nước ngon lành trên tay bạn, chúng tôi luôn nỗ lực gìn giữ tinh túy tự nhiên tốt lành nhất.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Leaf,
                title: "Nguồn Gốc Di Sản",
                subtitle: "Nông trại nguyên bản",
                desc: "Hạt cà phê Arabica và Robusta hảo hạng tuyển chọn cẩn thiện từ những vùng đất đỏ bazan cao nguyên lộng gió, dồi dào khoáng chất.",
                gradient: "from-[#b55239]/10 to-transparent",
                iconBg: "bg-gradient-to-tr from-[#b55239] to-[#c2624b]"
              },
              {
                step: "02",
                icon: Zap,
                title: "Rang Mới Mỗi Ngày",
                subtitle: "Chu kỳ giữ trọn hương",
                desc: "Quy trình rang xay hiện đại khép kín hoàn tất trong 24h bởi các chuyên gia lành nghề, đảm bảo hạt cà phê luôn tươi mới và thơm nồng nàn.",
                gradient: "from-[#5a3e36]/10 to-transparent",
                iconBg: "bg-gradient-to-tr from-[#5a3e36] to-[#7c564c]"
              },
              {
                step: "03",
                icon: Award,
                title: "Trải Nghiệm Trọn Vẹn",
                subtitle: "Phục vụ nhanh chóng",
                desc: "Mỗi ly thức uống được pha chế thủ công kỹ lưỡng và giao đến tay bạn trong vòng 5 phút, giữ trọn hương vị nguyên chất nguyên bản nhất.",
                gradient: "from-[#b55239]/10 via-[#5a3e36]/5 to-transparent",
                iconBg: "bg-gradient-to-tr from-[#b55239] via-[#8f3b2c] to-[#5a3e36]"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_20px_50px_rgba(90,62,54,0.04)] backdrop-blur-md"
                >
                  <div className={`absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-40 blur-2xl`} />

                  <span className="absolute top-6 right-8 text-6xl font-black text-[#5a3e36]/5 select-none">
                    {item.step}
                  </span>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg} text-white shadow-md shadow-[#5a3e36]/10 mb-6`}>
                        <Icon size={26} />
                      </div>
                      
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#b55239] mb-1">
                        {item.subtitle}
                      </span>
                      
                      <h3 className="text-xl font-extrabold text-stone-900 mb-3">
                        {item.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-stone-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl border border-white/60 bg-white/30 p-6 shadow-sm backdrop-blur-sm">
            {[
              { val: "100%", label: "Cà phê mộc sạch" },
              { val: "24h", label: "Chu kỳ rang mới" },
              { val: "5 phút", label: "Thời gian phục vụ" },
              { val: "98%", label: "Khách hàng hài lòng" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-3 border-r last:border-r-0 border-[#e7d8c9]/40 last:border-0">
                <div className="text-3xl font-black bg-gradient-to-r from-[#5a3e36] to-[#b55239] bg-clip-text text-transparent">{stat.val}</div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
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
