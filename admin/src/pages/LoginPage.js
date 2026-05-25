import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";
import { authAPI } from "../utils/api";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await authAPI.login(formData.email, formData.password);

      const { token, user } = response.data;

      if (user?.role !== "admin") {
        setError("Tài khoản này không có quyền admin");
        return;
      }

      if (token) {
        login(token);
        onLoginSuccess();
        navigate("/dashboard");
      } else {
        setError("Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      setError("Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚙️</div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Quản lý cửa hàng cà phê</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="flex-1 ml-2 outline-none"
                  placeholder="admin@coffeeshop.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Mật Khẩu
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="flex-1 ml-2 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Đang Xử Lý..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-3">
              Tài khoản Demo:
            </p>
            <p className="text-xs text-gray-600 text-center">
              Email: admin@coffeeshop.com
              <br />
              Mật Khẩu: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
