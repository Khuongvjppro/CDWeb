import React, { useState, useEffect } from "react";
import { Star, Send, AlertCircle } from "lucide-react";
import { reviewAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ReviewSection({ productId, onStatsLoad }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getByProduct(productId);
      setReviews(response.data.reviews);
      setStats(response.data.stats);
      if (onStatsLoad) {
        onStatsLoad(response.data.stats);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await reviewAPI.create({ productId, rating, comment });
      setSuccess("Cảm ơn bạn đã đánh giá sản phẩm!");
      setComment("");
      setRating(5);
      fetchReviews(); // reload reviews
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (ratingValue, size = 16) => {
    return (
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= Math.round(ratingValue) ? "currentColor" : "none"}
            className={star <= Math.round(ratingValue) ? "text-amber-400" : "text-stone-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-100">
      <h3 className="text-2xl font-bold text-[#3f2f29] mb-6 flex items-center gap-3">
        Đánh giá sản phẩm
        <span className="text-base font-normal bg-[#f7e7d7] text-[#8f3b2c] px-3 py-1 rounded-full">
          {stats.reviewCount} đánh giá
        </span>
      </h3>

      {/* Stats Summary */}
      {stats.reviewCount > 0 && (
        <div className="flex items-center gap-4 mb-8 bg-[#f9f6f0] p-4 rounded-2xl">
          <div className="text-4xl font-black text-[#b55239]">{stats.averageRating}</div>
          <div>
            {renderStars(stats.averageRating, 20)}
            <div className="text-sm text-stone-500 mt-1">Dựa trên {stats.reviewCount} đánh giá</div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <div className="mb-10">
        <h4 className="font-semibold text-stone-800 mb-4">Viết đánh giá của bạn</h4>
        {!isAuthenticated() ? (
          <div className="bg-stone-50 rounded-2xl p-6 text-center border border-stone-200">
            <p className="text-stone-600 mb-3">Vui lòng đăng nhập để gửi đánh giá.</p>
            <Link to="/login" className="bg-[#5a3e36] text-white inline-block px-6 py-2 rounded-xl transition hover:bg-[#3f2f29]">Đăng nhập ngay</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#f9f6f0] p-5 sm:p-6 rounded-2xl">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 text-sm">
                ✓ {success}
              </div>
            )}

            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-stone-600 font-medium">Chất lượng:</span>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                    className={star <= (hoverRating || rating) ? "text-amber-400 transition-transform hover:scale-110" : "text-stone-300"}
                  />
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
              className="w-full rounded-xl border border-stone-200 p-3 outline-none focus:border-[#b55239] focus:ring-2 focus:ring-[#b55239]/20 resize-none bg-white"
              rows="3"
            ></textarea>

            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="mt-4 flex items-center gap-2 bg-[#b55239] hover:bg-[#8f3b2c] text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {submitting ? "Đang gửi..." : "Gửi Đánh Giá"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div>
        <h4 className="font-semibold text-stone-800 mb-4 border-b border-stone-100 pb-2">Tất cả đánh giá</h4>
        {loading ? (
          <div className="text-center py-6 text-stone-500">Đang tải...</div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-[#3f2f29]">{rev.user_name}</div>
                  <div className="text-xs text-stone-400">
                    {new Date(rev.created_at).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
                {renderStars(rev.rating)}
                <p className="mt-3 text-stone-700 leading-relaxed text-sm">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500">
            Chưa có đánh giá nào. Bạn hãy trở thành người đầu tiên nhé!
          </div>
        )}
      </div>
    </div>
  );
}
