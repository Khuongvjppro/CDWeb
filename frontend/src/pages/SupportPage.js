import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      id: 1,
      question: "Làm sao để đăng ký thành viên Highlands Style?",
      answer:
        "Bạn có thể đăng ký thành viên qua ứng dụng hoặc website. Chỉ cần nhập email, tạo mật khẩu, và điền các thông tin cơ bản. Sau khi xác nhận email, tài khoản của bạn sẽ được kích hoạt ngay lập tức. Thành viên mới sẽ nhận được voucher giảm giá 10% cho đơn hàng đầu tiên.",
    },
    {
      id: 2,
      question: "Chính sách giao hàng và phí ship được tính như thế nào?",
      answer:
        "Chúng tôi cung cấp giao hàng miễn phí cho đơn hàng từ 200,000 VND trở lên tại các khu vực trong thành phố. Đơn hàng dưới 200,000 VND sẽ được tính phí ship 20,000 VND. Thời gian giao hàng thường từ 2-3 ngày làm việc. Bạn có thể theo dõi đơn hàng realtime qua ứng dụng hoặc website.",
    },
    {
      id: 3,
      question: "Tôi có thể đặt đơn hàng số lượng lớn cho sự kiện không?",
      answer:
        "Hoàn toàn được! Highlands Coffee cung cấp dịch vụ cung cấp cà phê cho sự kiện và doanh nghiệp. Đối với đơn hàng số lượng lớn (từ 50 sản phẩm trở lên), bạn sẽ được hưởng chiết khấu đặc biệt. Vui lòng liên hệ với chúng tôi qua hotline hoặc email để được tư vấn chi tiết và báo giá.",
    },
    {
      id: 4,
      question: "Có chính sách hoàn trả nếu tôi không hài lòng với sản phẩm?",
      answer:
        "Chúng tôi cam kết hoàn tiền 100% nếu sản phẩm gặp vấn đề như không đúng với mô tả, bị hư hỏng, hoặc không còn tươi mới. Yêu cầu hoàn trả phải được gửi trong vòng 24 giờ kể từ khi nhận hàng kèm theo hình ảnh chứng minh. Quá trình hoàn tiền sẽ được xử lý trong 5-7 ngày làm việc.",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Hotline Hỗ Trợ",
      details: "1800 - 1234",
      description: "Gọi ngay để được tư vấn",
      color: "from-[#b55239] to-[#8b4513]",
      iconColor: "text-white",
      iconBg: "bg-[#b55239]",
      action: "Gọi Ngay",
    },
    {
      icon: Mail,
      title: "Email Hỗ Trợ",
      details: "support@highlands.vn",
      description: "Gửi email và nhận phản hồi trong 24h",
      color: "from-[#5a3e36] to-[#7a1e2e]",
      iconColor: "text-white",
      iconBg: "bg-[#5a3e36]",
      action: "Gửi Email",
    },
    {
      icon: MessageCircle,
      title: "Chat Trực Tuyến",
      details: "Đang hoạt động",
      description: "Trò chuyện với nhân viên hỗ trợ",
      color: "from-[#e7d8c9] to-[#f3e6d9]",
      iconColor: "text-[#5a3e36]",
      iconBg: "bg-[#f3e6d9]",
      action: "Trò Chuyện",
    },
  ];

  const subjects = [
    { value: "general", label: "Tổng Quát" },
    { value: "order", label: "Về Đơn Hàng" },
    { value: "shipping", label: "Về Giao Hàng" },
    { value: "payment", label: "Về Thanh Toán" },
    { value: "refund", label: "Về Hoàn Trả" },
    { value: "product", label: "Về Sản Phẩm" },
    { value: "other", label: "Khác" },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "general",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-shell">
      <div className="page-content">
        {/* Section 1: Hero Search Section */}
        <section className="section-wrap pt-6 sm:pt-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a1e2e] via-[#b55239] to-[#e7d8c9] p-12 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)] mb-6">
                CHÚNG TÔI CÓ THỂ GIÚP GÌ CHO BẠN?
              </h1>

              <div className="relative mt-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-stone-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm câu hỏi hoặc từ khóa..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-white/20 bg-white/95 text-stone-900 placeholder-stone-500 font-medium shadow-[0_20px_60px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all"
                />
              </div>

              {searchQuery && (
                <p className="mt-4 text-white/80 text-sm">
                  Tìm thấy <span className="font-bold">{filteredFAQs.length}</span>{" "}
                  kết quả
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: FAQs Accordion */}
        <section className="section-wrap">
          <div className="section-heading">
            <span className="eyebrow">Câu Hỏi Phổ Biến</span>
            <h2 className="title-xl">Câu Hỏi Thường Gặp</h2>
            <p className="muted-copy">
              Tìm câu trả lời nhanh chóng cho các câu hỏi phổ biến nhất từ khách
              hàng của chúng tôi.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:border-[#b55239] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-[#fdf6f0] transition-colors"
                  >
                    <h3 className="text-left font-bold text-stone-900 text-lg leading-7">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={24}
                      className={`text-[#b55239] flex-shrink-0 transition-transform duration-300 ${
                        expandedFAQ === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedFAQ === faq.id && (
                    <div className="px-6 py-5 bg-[#fdf6f0] border-t border-stone-100">
                      <p className="text-stone-700 leading-7">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle
                  size={48}
                  className="mx-auto text-stone-300 mb-4"
                />
                <p className="text-stone-600 text-lg">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Contact Cards */}
        <section className="section-wrap">
          <div className="section-heading">
            <span className="eyebrow">Liên Hệ Trực Tiếp</span>
            <h2 className="title-xl">Bạn vẫn cần trợ giúp?</h2>
            <p className="muted-copy">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều phương thức liên lạc
              khác nhau.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${method.color} p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(0,0,0,0.15)] hover:-translate-y-2`}
                >
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20 group-hover:scale-125 transition-transform duration-500" />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${method.iconBg} ${method.iconColor} mb-4`}
                    >
                      <Icon size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-2xl font-black text-white mb-2">
                      {method.details}
                    </p>
                    <p className="text-white/80 text-sm mb-6">
                      {method.description}
                    </p>

                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 border border-white/30">
                      {method.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Feedback Form */}
        <section className="section-wrap pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="section-heading text-center">
              <span className="eyebrow">Phản Hồi Của Bạn</span>
              <h2 className="title-xl">Gửi Ý Kiến & Góp Ý</h2>
              <p className="muted-copy">
                Chúng tôi rất mong nhận được ý kiến từ bạn để cải thiện dịch vụ.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200">
                <p className="text-green-800 font-semibold">
                  ✓ Cảm ơn bạn! Yêu cầu của bạn đã được gửi thành công. Chúng
                  tôi sẽ phản hồi trong 24-48 giờ.
                </p>
              </div>
            )}

            <form
              onSubmit={handleFormSubmit}
              className="space-y-6 bg-white p-8 rounded-3xl border border-stone-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nhập họ và tên của bạn"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#b55239] focus:border-transparent transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#b55239] focus:border-transparent transition-all"
                />
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  Chủ Đề Cần Hỗ Trợ
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#b55239] focus:border-transparent transition-all"
                >
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  Nội Dung Tin Nhắn
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Vui lòng nhập chi tiết vấn đề hoặc ý kiến của bạn..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#b55239] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7a1e2e] to-[#b55239] text-white font-bold uppercase tracking-widest hover:shadow-[0_20px_60px_rgba(122,30,46,0.3)] hover:-translate-y-1 transition-all duration-300"
              >
                Gửi Yêu Cầu
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
