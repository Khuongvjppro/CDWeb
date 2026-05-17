import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../utils/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, getTotalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    notes: "",
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (cart.length === 0) {
    return <Navigate to="/cart" />;
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
    setLoading(true);

    try {
      const orderData = {
        items: cart,
        totalAmount: getTotalAmount(),
        shippingAddress: `${formData.address}, ${formData.phone}`,
      };

      await orderAPI.create(orderData);
      alert("Đặt hàng thành công!");
      clearCart();
      navigate("/orders");
    } catch (error) {
      alert("Lỗi khi đặt hàng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content section-wrap">
        <div className="hero-panel-soft p-6 sm:p-8">
          <span className="section-kicker">Checkout</span>
          <h1 className="title-xl">Thanh toán</h1>
          <p className="muted-copy">
            Một bước thanh toán sạch, rõ và đủ sang để người dùng cảm thấy yên
            tâm trước khi đặt hàng.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="premium-panel p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-stone-900">
              Thông tin giao hàng
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Ghi chú đơn hàng
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </form>
          </div>

          <aside className="premium-panel h-fit lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-stone-900">
              Đơn hàng của bạn
            </h2>
            <div className="mt-6 space-y-4 border-b border-stone-200 pb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-stone-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-500">x{item.quantity}</p>
                  </div>
                  <p className="font-bold text-stone-900">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-stone-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{getTotalAmount().toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-stone-950 px-4 py-4 text-white">
              <span className="text-sm uppercase tracking-[0.2em] text-stone-300">
                Tổng
              </span>
              <span className="text-2xl font-black text-amber-300">
                {getTotalAmount().toLocaleString("vi-VN")}₫
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
