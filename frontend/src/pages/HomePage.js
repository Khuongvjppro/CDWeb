import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Leaf, Award, ChevronLeft, ChevronRight, Sparkles, Coffee, Snowflake, Grid, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { productAPI } from "../utils/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
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
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = (activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory)
  ).slice(0, 6);

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="pt-0">
          <div className="relative min-h-[62vh] w-full overflow-hidden rounded-[2rem] border border-[#e7d8c9]/40 bg-[#5a3e36]/5 shadow-sm">
            {/* Background Image with elegant overlay for text readability */}
            <img
              src={slides[activeSlide].image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#5a3e36]/75 via-[#5a3e36]/30 to-transparent pointer-events-none" />

            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
              <svg
                className="h-10 w-full rotate-180"
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

            {/* Overlaid Info Card inside Slider */}
            <div className="relative mx-auto flex min-h-[62vh] max-w-6xl items-center justify-start px-6 py-12 md:px-12">
              <div className="relative z-10 max-w-lg rounded-[2.5rem] border border-white/20 bg-black/25 p-6 text-left shadow-[0_24px_80px_rgba(32,20,14,0.25)] backdrop-blur-md transition-all duration-500 hover:border-white/30 sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#b55239] px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md">
                  <Sparkles size={11} className="animate-pulse" />
                  {slides[activeSlide].tag}
                </span>
                
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-serif leading-none drop-shadow-sm">
                  {slides[activeSlide].title}
                </h1>
                
                <p className="mt-3.5 text-stone-200 text-sm sm:text-base leading-relaxed font-medium">
                  {slides[activeSlide].subtitle}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-semibold text-[#fdf6f0] backdrop-blur-sm">
                    {slides[activeSlide].badgeLeft}
                  </span>
                  <span className="rounded-full bg-[#b55239]/20 border border-[#b55239]/20 px-3 py-1 text-[11px] font-semibold text-[#fdf6f0] backdrop-blur-sm">
                    {slides[activeSlide].badgeRight}
                  </span>
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b55239] to-[#c2624b] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#b55239]/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                  >
                    Khám phá thực đơn
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute inset-x-0 bottom-4 px-6 z-20">
              <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/25 active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === index ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/25 active:scale-95"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Journey of Flavor */}
        <section className="section-wrap relative py-12 sm:py-14">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#b55239]/4 to-[#e7d8c9]/25 blur-[130px] pointer-events-none -z-10" />

          <div className="text-center max-w-4xl mx-auto mb-10">
            <span className="eyebrow mx-auto">
              <Zap size={10} className="text-[#b55239] animate-pulse" />
              Hành trình hương vị
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#5a3e36] leading-tight font-serif sm:whitespace-nowrap">
              Tâm Huyết Trong Từng Giọt Cà Phê
            </h2>
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-[#b55239] to-transparent mx-auto mt-4" />
            <p className="mt-4 text-base text-[#7a665f] sm:text-lg font-medium leading-relaxed">
              Từ nông trại xanh mướt Buôn Ma Thuột đến ly nước ngon lành trên tay bạn, chúng tôi luôn nỗ lực gìn giữ tinh túy tự nhiên tốt lành nhất.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Leaf,
                title: "Nguồn Gốc Di Sản",
                subtitle: "Nông trại nguyên bản",
                desc: "Hạt cà phê Arabica và Robusta hảo hạng tuyển chọn cẩn thận từ những vùng đất đỏ bazan cao nguyên dồi dào khoáng chất.",
                border: "border-[#b55239]/20",
                iconColor: "text-[#b55239]"
              },
              {
                step: "02",
                icon: Zap,
                title: "Rang Mới Mỗi Ngày",
                subtitle: "Chu kỳ giữ trọn hương",
                desc: "Quy trình rang xay hiện đại khép kín hoàn tất trong 24h bởi các chuyên gia lành nghề, đảm bảo hạt cà phê luôn tươi mới.",
                border: "border-[#5a3e36]/20",
                iconColor: "text-[#5a3e36]"
              },
              {
                step: "03",
                icon: Award,
                title: "Trải Nghiệm Trọn Vẹn",
                subtitle: "Phục vụ nhanh chóng",
                desc: "Mỗi ly thức uống được pha chế thủ công kỹ lưỡng và giao đến tay bạn trong vòng 5 phút, giữ trọn hương vị nguyên chất.",
                border: "border-[#b55239]/20",
                iconColor: "text-[#b55239]"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-[#e7d8c9] bg-white/50 p-6 shadow-[0_15px_45px_rgba(90,62,54,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-[0_30px_70px_rgba(90,62,54,0.09)]"
                >
                  {/* Decorative double border inside for vintage styling */}
                  <div className={`absolute inset-2.5 rounded-[2rem] border border-dashed ${item.border} pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity duration-300`} />

                  <span className="absolute top-4 right-6 text-6xl font-black text-[#5a3e36]/5 select-none font-serif group-hover:text-[#5a3e36]/10 transition-colors duration-300">
                    {item.step}
                  </span>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-[#e7d8c9] text-stone-900 shadow-sm mb-5 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#5a3e36]/5">
                        <Icon size={18} />
                      </div>
                      
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#b55239] mb-1">
                        {item.subtitle}
                      </span>
                      
                      <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">
                        {item.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-stone-600 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-[2.5rem] border border-[#e7d8c9] bg-gradient-to-r from-white/70 via-white/50 to-white/70 py-5 px-6 shadow-sm backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#b55239]/65 to-transparent" />
            
            {[
              { val: "100%", label: "Cà phê mộc sạch" },
              { val: "24h", label: "Chu kỳ rang mới" },
              { val: "5 phút", label: "Thời gian phục vụ" },
              { val: "98%", label: "Khách hàng hài lòng" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-2 border-r last:border-r-0 border-[#e7d8c9] last:border-0">
                <div className="text-3xl font-black bg-gradient-to-r from-[#5a3e36] to-[#b55239] bg-clip-text text-transparent font-serif">{stat.val}</div>
                <div className="text-[11px] font-bold text-[#7a665f] uppercase tracking-widest mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Featured Products */}
        <section className="section-wrap py-12 sm:py-14 relative overflow-visible">
          {/* Ambient Glowing background decoration */}
          <div className="absolute top-1/4 left-1/12 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#b55239]/8 to-transparent blur-[90px] pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 right-1/12 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#5a3e36]/8 to-transparent blur-[110px] pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#e7d8c9]/30 pb-5">
            <div className="space-y-2.5 max-w-xl">
              <span className="eyebrow inline-flex items-center gap-1.5 py-1 px-3">
                <Sparkles size={12} className="animate-pulse text-[#b55239]" />
                Đặc biệt / Featured
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#5a3e36] via-[#8f3b2c] to-[#b55239] bg-clip-text text-transparent font-serif">
                Sản phẩm nổi bật
              </h2>
              <p className="text-[#7a665f] text-sm sm:text-base font-medium">
                Khám phá những thức uống được yêu thích nhất, mang hương vị đặc trưng làm nên thương hiệu của chúng tôi.
              </p>
            </div>
            
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-[#e7d8c9] bg-white/70 backdrop-blur-md px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5a3e36] shadow-sm hover:shadow-md hover:border-[#b55239] transition duration-300 hover:bg-stone-900 hover:text-white"
            >
              Xem tất cả
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Category Tabs / Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {[
              { id: "all", name: "Tất Cả", icon: Grid },
              { id: "Cà phê", name: "Cà Phê", icon: Coffee },
              { id: "Trà", name: "Trà", icon: Leaf },
              { id: "Freeze", name: "Freeze", icon: Snowflake },
            ].map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#b55239] to-[#c2624b] text-white shadow-lg shadow-[#b55239]/25 scale-[1.03]"
                      : "bg-white/40 border border-white/50 text-[#5a3e36]/80 hover:bg-white/80 hover:text-[#5a3e36] hover:translate-y-[-1px]"
                  }`}
                >
                  <IconComponent size={14} className={isActive ? "animate-pulse" : ""} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          {displayedProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/60 bg-white/30 p-12 text-center backdrop-blur-md">
              <span className="text-3xl">☕</span>
              <h3 className="mt-3 text-lg font-bold text-[#5a3e36]">Không có sản phẩm nào</h3>
              <p className="text-sm text-[#7a665f] mt-1">Danh mục này hiện đang được cập nhật sản phẩm.</p>
            </div>
          )}
        </section>

        {/* Section: Newsletter */}
        <section className="section-wrap pt-0 pb-12">
          <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#5a3e36] via-[#4e342d] to-[#3a2520] px-6 py-10 text-white shadow-[0_30px_90px_rgba(90,62,54,0.3)] sm:px-8 sm:py-12">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#b55239]/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full border border-dashed border-white/5 pointer-events-none" />
            
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="eyebrow border-white/10 bg-white/5 text-[#f3e6d9] inline-flex items-center gap-1.5 py-1 px-3">
                  <Sparkles size={11} className="text-[#d9a05b] animate-pulse" />
                  Bản Tin / Newsletter
                </span>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl font-serif text-white tracking-tight leading-tight">
                  Nhận ưu đãi đặc biệt & sản phẩm mới
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300">
                  Đăng ký email để trở thành thành viên thân thiết. Nhận ngay voucher giảm giá 15% cho lượt mua hàng trực tuyến đầu tiên của bạn.
                </p>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex flex-col gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn..."
                      className="w-full rounded-full border border-white/15 bg-white/5 pl-5 pr-5 py-2.5 text-sm text-white outline-none transition placeholder:text-stone-400 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/20"
                    />
                  </div>
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b55239] to-[#c2624b] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-[#c2624b] hover:to-[#b55239] active:scale-[0.98]">
                    Đăng Ký Thành Viên
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
                <p className="mt-3 text-center text-[10px] text-stone-400">
                  * Chúng tôi cam kết bảo mật thông tin và không gửi thư rác.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


