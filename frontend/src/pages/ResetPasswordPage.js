import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token || !email) {
      setErrorMsg("Đường dẫn khôi phục mật khẩu không hợp lệ (thiếu token hoặc email).");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email,
        token,
        newPassword,
      });
      setSuccessMsg(response.data?.message || "Đặt lại mật khẩu thành công! ✨");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Đường dẫn khôi phục mật khẩu đã hết hạn hoặc không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#b55239]">Bảo mật</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#5a3e36]">Đặt Lại Mật Khẩu</h1>
          <p className="mt-2 text-sm text-stone-500">Nhập mật khẩu mới của bạn để khôi phục quyền truy cập tài khoản.</p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/45 p-6 sm:p-8 shadow-[0_20px_50px_rgba(90,62,54,0.06)] backdrop-blur-md">
          {successMsg && (
            <div className="mb-6 flex flex-col items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center text-sm text-emerald-800 animate-in fade-in duration-300">
              <CheckCircle className="text-emerald-500" size={24} />
              <span className="font-semibold">{successMsg}</span>
              <span className="text-xs text-stone-500 mt-1">Đang tự động chuyển hướng về trang đăng nhập...</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-800 animate-in fade-in duration-300">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#5a3e36]/70 uppercase tracking-wider mb-2">
                  Mật khẩu mới *
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-[#b55239] transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3.5 text-sm text-[#5a3e36] outline-none transition duration-300 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a3e36]/70 uppercase tracking-wider mb-2">
                  Xác nhận mật khẩu mới *
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-[#b55239] transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3.5 text-sm text-[#5a3e36] outline-none transition duration-300 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5a3e36] to-[#b55239] py-3.5 text-sm font-bold text-white shadow-md shadow-[#5a3e36]/10 transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Đang lưu mật khẩu...</span>
                    </>
                  ) : (
                    <span>Lưu mật khẩu mới</span>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-stone-100 pt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#b55239] hover:text-[#5a3e36] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Quay lại trang Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
