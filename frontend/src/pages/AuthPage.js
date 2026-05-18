import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Phone } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  const defaultTab = location.pathname.includes("register")
    ? "register"
    : "login";
  const [tab, setTab] = useState(defaultTab);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((p) => ({ ...p, [name]: value }));
  };

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegData((p) => ({ ...p, [name]: value }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(regData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setTab("login");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content section-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
        <div className="w-full max-w-5xl overflow-hidden surface-card">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#2a140d,#5a2417_55%,#8c3a17)] p-8 text-white lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_55%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="eyebrow border-white/10 bg-white/10 text-amber-100">
                    Highlands-inspired access
                  </span>
                  <h2 className="mt-5 text-4xl font-black leading-tight">
                    Một trang, hai lựa chọn. Đăng nhập hoặc đăng ký thật gọn.
                  </h2>
                  <p className="mt-4 max-w-md text-stone-200/90 leading-7">
                    Tông nâu - vàng ấm, khối bo lớn, và cảm giác cao cấp giống
                    các trang bán lẻ cà phê hiện đại.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="hero-stat">
                    <div className="text-3xl">☕</div>
                    <p className="mt-3 text-sm text-stone-200">
                      Đăng nhập nhanh, tiếp tục mua sắm ngay.
                    </p>
                  </div>
                  <div className="hero-stat">
                    <div className="text-3xl">🧾</div>
                    <p className="mt-3 text-sm text-stone-200">
                      Đăng ký để lưu thông tin và theo dõi đơn.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {error}
                </div>
              )}

              <div className="premium-panel">
                <div className="mb-5">
                  <h1 className="text-3xl font-black text-stone-950">
                    {tab === "login"
                      ? "Chào mừng bạn quay lại"
                      : "Tạo tài khoản CoffeeShop"}
                  </h1>
                  <p className="mt-2 text-stone-500">
                    {tab === "login"
                      ? "Nhập tài khoản để tiếp tục trải nghiệm mua sắm."
                      : "Chỉ vài thông tin cơ bản để bắt đầu."}
                  </p>
                </div>

                {tab === "login" ? (
                  <form onSubmit={submitLogin} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-stone-700">
                        Email
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
                        <Mail size={18} className="text-stone-400" />
                        <input
                          name="email"
                          type="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
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
                          name="password"
                          type="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
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
                ) : (
                  <form onSubmit={submitRegister} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-stone-700">
                        Họ tên
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
                        <User size={18} className="text-stone-400" />
                        <input
                          name="fullName"
                          type="text"
                          value={regData.fullName}
                          onChange={handleRegChange}
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
                          name="email"
                          type="email"
                          value={regData.email}
                          onChange={handleRegChange}
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
                          name="phone"
                          type="tel"
                          value={regData.phone}
                          onChange={handleRegChange}
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
                          name="password"
                          type="password"
                          value={regData.password}
                          onChange={handleRegChange}
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
                )}

                {tab === "login" ? (
                  <div className="mt-6 text-center text-sm text-stone-600">
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("register")}
                      className="font-semibold text-amber-800 hover:text-amber-900"
                    >
                      Đăng ký
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 text-center text-sm text-stone-600">
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="font-semibold text-amber-800 hover:text-amber-900"
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
