import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { id: "all", label: "Tất Cả" },
    { id: "coffee", label: "Chuyện Cà Phê" },
    { id: "promo", label: "Khuyến Mãi" },
    { id: "event", label: "Sự Kiện" },
    { id: "recruit", label: "Tuyển Dụng" },
  ];

  const allNews = [
    {
      id: 1,
      title: "Tuyên Bố Hợp Tác Với 10 Nông Trại Mới Tại Tây Nguyên",
      excerpt:
        "Highlands Coffee viự hạnh thông báo hợp tác với 10 nông trại cà phê truyền thống tại khu vực Tây Nguyên, đảm bảo nguồn cung cấp hạt cà phê chất lượng cao...",
      category: "coffee",
      date: "2026-05-15",
      image: "from-[#e7d8c9] to-[#5a3e36]/20",
      featured: false,
    },
    {
      id: 2,
      title: "Khuyến Mãi Cuối Tháng 5: Mua 2 Tặng 1",
      excerpt:
        "Cả tuần cuối tháng, khách hàng thân thiết sẽ được ưu đãi mua 2 sản phẩm tặng 1 sản phẩm tương đương hoặc rẻ hơn...",
      category: "promo",
      date: "2026-05-14",
      image: "from-[#f3e6d9] to-[#b55239]/20",
      featured: false,
    },
    {
      id: 3,
      title: "Sự Kiện Coffee Tasting: Hành Trình 10 Năm Highlands",
      excerpt:
        "Khách mời được tham gia hành trình khám phá 10 năm phát triển của Highlands thông qua 5 loại cà phê đặc biệt...",
      category: "event",
      date: "2026-05-13",
      image: "from-[#e7d8c9] to-[#f3e6d9]",
      featured: false,
    },
    {
      id: 4,
      title: "Tuyển Dụng: Vị Trí Barista & Coffee Specialist",
      excerpt:
        "Highlands Coffee đang tuyển dụng 20 Barista và Coffee Specialist tại 5 chi nhánh mới. Yêu cầu: kỹ năng giao tiếp tốt...",
      category: "recruit",
      date: "2026-05-12",
      image: "from-[#fdf6f0] to-[#e7d8c9]",
      featured: false,
    },
    {
      id: 5,
      title: "Khám Phá: Quy Trình Rang Xay Thủ Công Của Highlands",
      excerpt:
        "Bài viết này sẽ đưa bạn vào hậu trường để hiểu rõ từng bước trong quy trình rang xay cà phê thủ công...",
      category: "coffee",
      date: "2026-05-11",
      image: "from-[#b55239] to-[#5a3e36]/30",
      featured: false,
    },
    {
      id: 6,
      title: "Sự Kiện Mở Cửa Chi Nhánh Mới Tại Khu Phố Văn Hóa",
      excerpt:
        "Khai trương chi nhánh mới nhất của Highlands tại trung tâm thành phố với không gian hiện đại, thoáng mát...",
      category: "event",
      date: "2026-05-10",
      image: "from-[#e7d8c9] to-[#b55239]",
      featured: false,
    },
    {
      id: 7,
      title: "Cà Phê Specialty: Những Điều Bạn Cần Biết",
      excerpt:
        "Specialty coffee không chỉ là một loại cà phê, mà là một triết lý. Hãy cùng Highlands khám phá...",
      category: "coffee",
      date: "2026-05-09",
      image: "from-[#f3e6d9] to-[#e7d8c9]",
      featured: false,
    },
    {
      id: 8,
      title: "Chương Trình Ưu Đãi Cho Thành Viên VIP",
      excerpt:
        "Những thành viên VIP sẽ nhận được các ưu đãi độc quyền như giảm giá 20% trên toàn bộ sản phẩm...",
      category: "promo",
      date: "2026-05-08",
      image: "from-[#7a1e2e] to-[#b55239]",
      featured: false,
    },
    {
      id: 9,
      title: "Tuyển Dụng: Vị Trí Marketing Executive",
      excerpt:
        "Highlands Coffee tìm kiếm Marketing Executive có kinh nghiệm trong lĩnh vực F&B hoặc Zero-based marketing...",
      category: "recruit",
      date: "2026-05-07",
      image: "from-[#e7d8c9] to-[#5a3e36]",
      featured: false,
    },
  ];

  // Featured post (tin nổi bật) - lấy bài đầu tiên hoặc bài mới nhất
  const featuredPost = {
    id: "featured-1",
    title: "Highlands Chính Thức Ra Mắt Bộ Sưu Tập Premium 2026",
    excerpt:
      "Sau 10 năm phát triển, Highlands Coffee tự hào giới thiệu bộ sưu tập cà phê Premium mới với những hạt cà phê được lựa chọn cẩn thận từ các vùng cao nguyên chính, qua quy trình rang xay thủ công tinh tế...",
    category: "coffee",
    date: "2026-05-20",
    image: "from-[#7a1e2e] via-[#b55239] to-[#e7d8c9]",
    featured: true,
  };

  // Filter news
  const filteredNews = allNews.filter(
    (news) => activeCategory === "all" || news.category === activeCategory
  );

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      coffee: "bg-[#b55239] text-white",
      promo: "bg-[#5a3e36] text-white",
      event: "bg-[#e7d8c9] text-[#5a3e36]",
      recruit: "bg-[#f3e6d9] text-[#5a3e36]",
    };
    return colors[category] || "bg-[#e7d8c9] text-[#5a3e36]";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        {/* Section 1: Featured Post - Hero Section */}
        <section className="section-wrap pt-6 sm:pt-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a1e2e] via-[#b55239] to-[#e7d8c9] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.15)] sm:p-12">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left Content */}
              <div className="max-w-2xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={18} className="text-[#fdf6f0]" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-[#fdf6f0]/90">
                    {formatDate(featuredPost.date)}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                  {featuredPost.title}
                </h1>

                <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="btn-primary text-white">
                    Đọc Tiếp
                    <ArrowRight size={18} />
                  </button>
                  <button className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white/30">
                    Lưu Lại
                  </button>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative flex items-center justify-center">
                <div className={`w-full h-80 rounded-3xl bg-gradient-to-br ${featuredPost.image} shadow-[0_30px_80px_rgba(0,0,0,0.2)]`} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Category Filter */}
        <section className="section-wrap">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-[#5a3e36] text-white shadow-[0_12px_40px_rgba(90,62,54,0.25)]"
                    : "bg-white/80 text-[#5a3e36] border border-white/20 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: News Grid */}
        <section className="section-wrap">
          {paginatedNews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedNews.map((news) => (
                <div
                  key={news.id}
                  className="surface-card-soft group flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${news.image} group-hover:scale-110 transition-transform duration-500`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-4 p-6 flex-grow">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryBadgeColor(
                          news.category
                        )}`}
                      >
                        {categories.find((c) => c.id === news.category)?.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold leading-7 text-stone-900 group-hover:text-[#b55239] transition-colors duration-300">
                      {news.title}
                    </h3>

                    {/* Date & Excerpt */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                        <Calendar size={14} />
                        <span>{formatDate(news.date)}</span>
                      </div>
                      <p className="text-sm leading-6 text-stone-600 line-clamp-2">
                        {news.excerpt}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#b55239] group-hover:gap-3 transition-all duration-300">
                        Đọc Tiếp
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-stone-600 text-lg">
                Không có tin tức nào trong danh mục này
              </p>
            </div>
          )}
        </section>

        {/* Section 4: Pagination */}
        {totalPages > 1 && (
          <section className="section-wrap pb-16">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-white border border-stone-200 text-[#5a3e36] hover:bg-[#5a3e36] hover:text-white hover:border-[#5a3e36] shadow-soft"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-11 min-w-[2.75rem] rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                        currentPage === page
                          ? "bg-[#5a3e36] text-white shadow-[0_12px_40px_rgba(90,62,54,0.25)]"
                          : "bg-white border border-stone-200 text-[#5a3e36] hover:bg-[#f3e6d9] hover:border-[#e7d8c9]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-white border border-stone-200 text-[#5a3e36] hover:bg-[#5a3e36] hover:text-white hover:border-[#5a3e36] shadow-soft"
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Page Info */}
            <div className="mt-6 text-center text-sm text-stone-600">
              Trang <span className="font-semibold text-[#5a3e36]">{currentPage}</span> của{" "}
              <span className="font-semibold text-[#5a3e36]">{totalPages}</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
