import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search, Star, Trash2 } from "lucide-react";
import { reviewAPI } from "../utils/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await reviewAPI.getAllAdmin();
      setReviews(response.data || []);
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError.response?.data?.message ||
          "Không thể tải danh sách đánh giá từ server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id, userName, productName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đánh giá của khách hàng "${userName}" cho sản phẩm "${productName}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      setError("");
      await reviewAPI.deleteAdmin(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa đánh giá.");
    }
  };

  const filteredReviews = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesKeyword =
        !keyword ||
        [review.user_name, review.user_email, review.product_name, review.comment]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(keyword));
      
      const matchesStar = starFilter === "all" || String(review.rating) === starFilter;

      return matchesKeyword && matchesStar;
    });
  }, [reviews, searchTerm, starFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, starFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculation
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: (sum / reviews.length).toFixed(1),
      count: reviews.length,
    };
  }, [reviews]);

  return (
    <div className="page-shell admin-shell">
      <div className="page-content section-wrap py-10">
        
        {/* Banner Section */}
        <div className="admin-panel-soft mb-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Link to="/admin/dashboard" className="admin-chip-soft">
                  <ArrowLeft size={16} />
                  Quay lại dashboard
                </Link>
              </div>
              <span className="section-kicker">Admin</span>
              <h1 className="title-xl">Quản lý đánh giá</h1>
              <p className="muted-copy mt-2 max-w-2xl">
                Danh sách ý kiến phản hồi, đánh giá từ khách hàng đã mua sản phẩm tại cửa hàng.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchReviews();
              }}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Dashboard Mini Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="admin-panel p-5 bg-[#5a3e36]/5 border-none shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Tổng số đánh giá</h3>
            <p className="mt-2 text-3xl font-black text-[#5a3e36]">{stats.count}</p>
          </div>
          <div className="admin-panel p-5 bg-[#b55239]/5 border-none shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Điểm đánh giá trung bình</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#b55239]">{stats.avg}</span>
              <span className="text-sm font-bold text-stone-400">/ 5.0</span>
              <div className="ml-2 flex gap-0.5 text-amber-500">
                {Array.from({ length: Math.round(Number(stats.avg)) }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="text-amber-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-panel mb-6 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
              <Search size={18} className="text-stone-400" />
              <input
                type="text"
                placeholder="Tìm theo sản phẩm, khách hàng, nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả xếp hạng</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Sao)</option>
              <option value="4">⭐⭐⭐⭐ (4 Sao)</option>
              <option value="3">⭐⭐⭐ (3 Sao)</option>
              <option value="2">⭐⭐ (2 Sao)</option>
              <option value="1">⭐ (1 Sao)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between text-sm text-stone-500">
          <span>
            Hiển thị{" "}
            {filteredReviews.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
            -{Math.min(currentPage * itemsPerPage, filteredReviews.length)} /{" "}
            {filteredReviews.length}
          </span>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
        </div>

        {/* Table list */}
        <div className="admin-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-stone-600">
              Đang tải danh sách đánh giá...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-stone-200 bg-stone-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Khách hàng</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Sản phẩm</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Xếp hạng</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Ý kiến phản hồi</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Ngày tạo</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-stone-500">
                        Không có đánh giá nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    paginatedReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="border-b border-stone-100 transition hover:bg-amber-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-stone-950">{review.user_name}</div>
                          <div className="text-xs text-stone-500">{review.user_email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-stone-900">
                          {review.product_name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < review.rating ? "currentColor" : "none"}
                                className={i < review.rating ? "text-amber-500" : "text-stone-300"}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-700 max-w-xs truncate" title={review.comment}>
                          {review.comment || <em className="text-stone-400">Không có ý kiến bình luận</em>}
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-600">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id, review.user_name, review.product_name)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={13} />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trang trước
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition ${
                  page === currentPage
                    ? "bg-amber-600 text-white"
                    : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
        
      </div>
    </div>
  );
}
