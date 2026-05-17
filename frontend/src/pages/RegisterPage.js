import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

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
      await register(formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content section-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
        <div className="grid w-full max-w-6xl gap-0 overflow-hidden surface-card lg:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,_#7c2d12,_#111827)] p-10 text-white lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_55%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="eyebrow border-white/10 bg-white/5 text-amber-100">
                  Create account
                </span>
                <h2 className="mt-5 text-4xl font-black leading-tight">
                  Tạo tài khoản để cá nhân hóa trải nghiệm mua cà phê.
                </h2>
                <p className="mt-4 max-w-md text-stone-300 leading-7">
                  Một layout hai cột giúp màn đăng ký có chiều sâu hơn và cảm
                  giác thương hiệu rõ hơn.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-3xl">🧾</div>
                  <p className="mt-3 text-sm text-stone-300">
                    Lưu địa chỉ, theo dõi đơn dễ dàng.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-3xl">🎁</div>
                  <p className="mt-3 text-sm text-stone-300">
                    Nhận ưu đãi và gợi ý phù hợp.
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
                Tạo tài khoản CoffeeShop
              </h1>
              <p className="mt-2 text-stone-500">
                Nhanh, gọn và đủ chuyên nghiệp.
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
                  Họ tên
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
                  <User size={18} className="text-stone-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập họ tên"
                  />
                </div>
              </div>

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
                  Số điện thoại
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
                  <Phone size={18} className="text-stone-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập số điện thoại"
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
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-stone-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-semibold text-amber-800 hover:text-amber-900"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
