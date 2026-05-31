import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Sprout, Users, Target } from "lucide-react";

export default function AboutHighlandsPage() {
  const coreValues = [
    {
      icon: Coffee,
      title: "Hạt Cà Phê Bản Địa",
      description:
        "Chọn lọc những hạt cà phê tốt nhất từ các vùng cao nguyên, đảm bảo chất lượng nguyên bản và hương vị đặc trưng.",
      color: "from-[#e7d8c9] to-[#f3e6d9]",
      iconColor: "text-[#b55239]",
      iconBg: "bg-[#f3e6d9]",
    },
    {
      icon: Sprout,
      title: "Rang Xay Thủ Công",
      description:
        "Quy trình rang và xay thủ công giữ nguyên mức độ hương vị tươi mới nhất, mỗi loại được chủ động điều chỉnh mức độ rang.",
      color: "from-[#f3e6d9] to-[#e7d8c9]",
      iconColor: "text-[#5a3e36]",
      iconBg: "bg-[#e7d8c9]",
    },
    {
      icon: Users,
      title: "Không Gian Kết Nối",
      description:
        "Tạo ra một cộng đồng cà phê nơi mọi người có thể gặp gỡ, chia sẻ câu chuyện và tìm kiếm những điều ý nghĩa.",
      color: "from-[#e7d8c9] to-[#f3e6d9]",
      iconColor: "text-[#b55239]",
      iconBg: "bg-[#f3e6d9]",
    },
    {
      icon: Target,
      title: "Cam Kết Tối Cao",
      description:
        "100% tận tâm từ lựa chọn hạt đến phục vụ khách hàng, mỗi tách cà phê đều mang theo tinh thần chúng tôi.",
      color: "from-[#f3e6d9] to-[#e7d8c9]",
      iconColor: "text-[#5a3e36]",
      iconBg: "bg-[#e7d8c9]",
    },
  ];

  const milestones = [
    { number: "10+", label: "Năm hành trình" },
    { number: "50+", label: "Đối tác nông trại" },
    { number: "100%", label: "Tận tâm" },
    { number: "1000+", label: "Khách hàng hài lòng" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content">
        {/* Section 1: Hero Banner */}
        <section className="section-wrap pt-6 sm:pt-8">
          <div className="hero-panel relative min-h-[70vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f3e6d9] via-[#e7d8c9] to-[#fdf6f0] opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_50%)]" />

            <div className="relative grid min-h-[70vh] items-center gap-8 px-6 py-12 lg:grid-cols-2 lg:px-12">
              {/* Left Content */}
              <div className="max-w-2xl">
                <span className="section-kicker border-[#7a1e2e]/30 bg-[#f3e6d9]/70 text-[#5a3e36]">
                  Lịch sử & hành trình
                </span>
                <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-[#5a3e36] drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:text-6xl">
                  STORY HIGHLANDS STYLE
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700 sm:text-xl">
                  Hành trình tìm kiếm hương vị cà phê nguyên bản bắt đầu từ một niềm đam mê đơn giản: 
                  đem đến cho mọi người một tách cà phê không chỉ ngon mà còn chứa đựng tình yêu và tâm huyết.
                </p>

                <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
                  Từ những nông trại cao nguyên đến ly cà phê trên tay bạn, mỗi bước đều được chúng tôi 
                  chọn lọc và yêu thương. Highlands không chỉ là một thương hiệu cà phê, mà là một 
                  triết lý sống — nơi chất lượng, tâm huyết và kết nối được đặt lên hàng đầu.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/products" className="btn-primary text-white">
                    Khám Phá Bộ Sưu Tập
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/register" className="btn-secondary">
                    Tham Gia Cộng Đồng
                  </Link>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative flex items-center justify-center">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#b55239]/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#5a3e36]/8 blur-3xl" />

                <div className="relative w-full max-w-lg">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-[#e7d8c9]/80 bg-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                    <img
                      src={"/banner/STORY%20HIGHLANDS%20STYLE.png"}
                      alt="Story Highlands Style"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Values */}
        <section className="section-wrap">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="eyebrow">Giá trị cốt lõi</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#5a3e36] sm:text-5xl">
                Những giá trị định hình Highlands
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#7a665f] sm:text-lg">
                Mỗi quyết định, mỗi hành động của chúng tôi đều xuất phát từ những
                giá trị cốt lõi này — chúng là nền tảng của mọi thứ chúng tôi làm.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#e7d8c9]/80 bg-white/70 p-5 text-sm text-[#6b5a54] shadow-[0_16px_40px_rgba(90,62,54,0.12)]">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b55239]">
                Highlands mindset
              </div>
              <p className="mt-2 leading-6">
                Tập trung vào nguồn gốc, quy trình thủ công và trải nghiệm cộng đồng —
                ba trụ cột tạo nên vị riêng của Highlands.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[2.2rem] border border-white/70 bg-gradient-to-br ${value.color} p-7 shadow-[0_20px_60px_rgba(90,62,54,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_90px_rgba(90,62,54,0.2)]`}
                >
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/45 transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-white/25" />
                  <div className="relative z-10">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 ${value.iconColor} shadow-[0_12px_30px_rgba(90,62,54,0.18)] transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-[#4b342d]">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#6b5a54]">
                      {value.description}
                    </p>
                    <div className="mt-5 h-px w-12 bg-[#b55239]/40" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Milestones/Stats */}
        <section className="section-wrap">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a1e2e] via-[#b55239] to-[#8b4513] p-12 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-center text-4xl font-black text-white tracking-tight mb-12 sm:text-5xl">
                Con số ấn tượng Highlands
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="group text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                  >
                    <div className="text-5xl font-black text-[#fdf6f0] tracking-tight group-hover:scale-110 transition-transform duration-300">
                      {milestone.number}
                    </div>
                    <div className="mt-3 text-lg font-semibold uppercase tracking-widest text-white/90">
                      {milestone.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Call to Action */}
        <section className="section-wrap pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f3e6d9] to-[#e7d8c9] p-12 text-center">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#b55239]/5 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-[#5a3e36] tracking-tight mb-4">
                Hãy trở thành một phần của Highlands
              </h2>
              <p className="text-lg text-stone-700 max-w-2xl mx-auto mb-8">
                Khám phá bộ sưu tập cà phê đặc biệt của chúng tôi và tham gia cộng đồng 
                những người yêu thích cà phê chất lượng cao.
              </p>
              <Link to="/products" className="btn-primary text-white inline-flex items-center gap-2">
                Khám Phá Ngay
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
