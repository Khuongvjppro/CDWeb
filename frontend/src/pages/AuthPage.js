import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Phone, Coffee, ArrowRight, X, CheckCircle, AlertCircle } from "lucide-react";
import { authAPI } from "../utils/api";

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

  // State quản lý Modal Quên mật khẩu
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

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
      const response = await login(loginData.email, loginData.password);
      const user = response?.user;

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đăng nhập. Vui lòng kiểm tra lại tài khoản.");
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
      setError(err.response?.data?.error || "Lỗi đăng ký. Email có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  const submitForgotPassword = async (e) => {
    e.preventDefault();
    setForgotSuccess("");
    setForgotError("");
    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(forgotEmail);
      setForgotSuccess(response.data?.message || "Đường dẫn đặt lại mật khẩu đã được gửi!");
    } catch (err) {
      setForgotError(err.response?.data?.error || "Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white px-4 py-3.5 shadow-sm focus-within:border-[#b55239] focus-within:ring-4 focus-within:ring-[#b55239]/5 transition-all duration-300 group";

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/45 shadow-[0_24px_70px_rgba(90,62,54,0.06)] backdrop-blur-md">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          
          {/* Left Hero Panel */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#2b1612] via-[#52291e] to-[#7c3d2f] p-10 text-white lg:flex lg:flex-col lg:justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,180,152,0.18),_transparent_60%)]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#b55239]/10 blur-3xl" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold text-amber-100/90">
                <Coffee size={14} className="text-[#f3b498]" />
                <span>Highlands-inspired Access</span>
              </div>
              <h2 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                Hương vị đậm đà,<br/>Khơi nguồn cảm hứng.<br/>Tách cà phê trọn vị mỗi ngày.
              </h2>
              <p className="mt-5 max-w-md text-stone-200/80 leading-relaxed text-sm">
                Khám phá những hạt cà phê thượng hạng được chọn lọc thủ công từ những vùng đất nổi tiếng. Đăng nhập hoặc đăng ký tài khoản để bắt đầu hành trình thưởng thức trọn vẹn hương vị yêu thích của bạn.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white/80">
            
            {/* Header info */}
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                {tab === "login" ? "Chào mừng bạn quay lại" : "Tạo tài khoản mới"}
              </h1>
              <p className="mt-2 text-sm text-stone-500">
                {tab === "login"
                  ? "Nhập tài khoản để tiếp tục mua sắm cà phê yêu thích."
                  : "Chỉ mất vài giây để bắt đầu trải nghiệm mua sắm."}
              </p>
            </div>

            {/* Tab Pill Bar */}
            <div className="mb-6 flex rounded-2xl bg-stone-100/80 p-1.5 border border-stone-200/30">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
                className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
                  tab === "login"
                    ? "bg-white text-[#5a3e36] shadow-md shadow-stone-200/50"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
                className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
                  tab === "register"
                    ? "bg-white text-[#5a3e36] shadow-md shadow-stone-200/50"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Alert banner */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3.5 text-sm text-red-700 animate-in fade-in duration-250">
                {error}
              </div>
            )}

            {/* Forms rendering */}
            {tab === "login" ? (
              <form onSubmit={submitLogin} className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="mb-2 block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                    Email đăng nhập
                  </label>
                  <div className={fieldClass}>
                    <Mail size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 pl-1">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotSuccess("");
                        setForgotError("");
                        setForgotEmail("");
                      }}
                      className="text-xs font-semibold text-[#b55239] hover:text-[#5a3e36] transition-colors"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className={fieldClass}>
                    <Lock size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                    <input
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5a3e36] to-[#b55239] py-3.5 text-sm font-bold text-white shadow-md shadow-[#5a3e36]/10 transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitRegister} className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="mb-2 block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                    Họ và tên *
                  </label>
                  <div className={fieldClass}>
                    <User size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                    <input
                      name="fullName"
                      type="text"
                      value={regData.fullName}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                      placeholder="Nhập họ tên"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                    Địa chỉ Email *
                  </label>
                  <div className={fieldClass}>
                    <Mail size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={regData.email}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                    Số điện thoại *
                  </label>
                  <div className={fieldClass}>
                    <Phone size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                    <input
                      name="phone"
                      type="tel"
                      value={regData.phone}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                    Mật khẩu *
                  </label>
                  <div className={fieldClass}>
                    <Lock size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                    <input
                      name="password"
                      type="password"
                      value={regData.password}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                      placeholder="Tạo mật khẩu đăng nhập"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5a3e36] to-[#b55239] py-3.5 text-sm font-bold text-white shadow-md shadow-[#5a3e36]/10 transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>

      {/* Premium Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_24px_70px_rgba(90,62,54,0.3)] backdrop-blur-xl animate-in zoom-in-95 duration-300 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-6 top-6 text-stone-400 hover:text-stone-700 transition-colors p-1 bg-stone-100 hover:bg-stone-200 rounded-full"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-[#b55239] shadow-inner mb-4">
                <Lock size={28} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-[#5a3e36]">Khôi Phục Mật Khẩu</h3>
              <p className="mt-2 text-xs text-stone-500 leading-relaxed">
                Đừng lo lắng! Hãy cung cấp email đăng ký, chúng tôi sẽ gửi đường dẫn khôi phục mật khẩu ngay lập tức.
              </p>
            </div>

            {/* Success and Error Alerts */}
            {forgotSuccess && (
              <div className="mb-5 rounded-2xl border border-emerald-150 bg-emerald-50/50 p-4 text-emerald-800 text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotError && (
              <div className="mb-5 rounded-2xl border border-red-150 bg-red-50/50 p-4 text-red-700 text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Request Form */}
            <form onSubmit={submitForgotPassword} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">
                  Địa chỉ Email đã đăng ký
                </label>
                <div className={fieldClass}>
                  <Mail size={18} className="text-stone-400 group-focus-within:text-[#b55239] transition-colors" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm text-[#5a3e36] outline-none placeholder:text-stone-400"
                    placeholder="your-email@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5a3e36] to-[#b55239] py-3.5 text-sm font-bold text-white shadow-md shadow-[#5a3e36]/10 transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? "Đang gửi yêu cầu..." : "Gửi liên kết khôi phục"}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full text-center text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors mt-2"
              >
                Hủy bỏ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
