import React, { useState } from "react";
import { useNavigate, Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    expired ? "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại." : ""
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content section-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
        <div className="grid w-full max-w-6xl gap-0 overflow-hidden surface-card lg:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-stone-950 p-10 text-white lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_55%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="eyebrow border-white/10 bg-white/5 text-amber-100">
                  Welcome back
                </span>
                <h2 className="mt-5 text-4xl font-black leading-tight">
                  Đăng nhập để quản lý đơn hàng và tiếp tục hành trình cà phê.
                </h2>
                <p className="mt-4 max-w-md text-stone-300 leading-7">
                  Bố cục chia đôi tạo cảm giác cao cấp hơn, đồng thời giúp form
                  đăng nhập không còn đơn điệu như một trang hệ thống.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-3xl">☕</div>
                  <p className="mt-3 text-sm text-stone-300">
                    Trải nghiệm mua hàng được cá nhân hóa.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-3xl">🔒</div>
                  <p className="mt-3 text-sm text-stone-300">
                    Bảo mật JWT và đồng bộ giỏ hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-900">
                ☕
              </div>
              <h1 className="mt-5 text-3xl font-black text-stone-950">
                Đăng nhập CoffeeShop
              </h1>
              <p className="mt-2 text-stone-500">
                Mỗi đăng nhập là một trải nghiệm gọn và sang.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
                  <Mail size={18} className="text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Mật khẩu
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
                  <Lock size={18} className="text-stone-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-stone-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-semibold text-amber-800 hover:text-amber-900"
              >
                Đăng ký
              </Link>
            </div>

            <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
              <div className="font-semibold text-stone-900">Tài khoản demo</div>
              <div className="mt-2">Email: user@example.com</div>
              <div>Password: 123456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
