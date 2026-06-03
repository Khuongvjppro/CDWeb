import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../utils/api";
import { CreditCard, Banknote } from "lucide-react";

const VIETNAM_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, getTotalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    district: "",
    province: "Hà Nội",
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

  const getShippingInfoByProvince = (province) => {
    if (province === "Hà Nội" || province === "TP. Hồ Chí Minh") {
      return {
        label: "Nội thành",
        fee: 15000,
        note: "Giao nhanh trong khu vực trung tâm",
      };
    }

    if (
      [
        "Đà Nẵng",
        "Hải Phòng",
        "Cần Thơ",
        "Bình Dương",
        "Đồng Nai",
        "Long An",
        "Bà Rịa - Vũng Tàu",
      ].includes(province)
    ) {
      return {
        label: "Khu vực lân cận",
        fee: 25000,
        note: "Áp dụng cho các tỉnh/thành gần",
      };
    }

    if (
      [
        "Quảng Ninh",
        "Hưng Yên",
        "Hải Dương",
        "Bắc Ninh",
        "Thái Nguyên",
        "Nam Định",
        "Ninh Bình",
        "Thừa Thiên Huế",
        "Khánh Hòa",
        "Lâm Đồng",
        "Quảng Nam",
        "Quảng Ngãi",
        "Thanh Hóa",
        "Nghệ An",
        "Hà Tĩnh",
      ].includes(province)
    ) {
      return {
        label: "Khu vực trung bình",
        fee: 35000,
        note: "Phù hợp các tỉnh thành còn lại",
      };
    }

    return {
      label: "Khu vực xa",
      fee: 45000,
      note: "Áp dụng cho các khu vực xa trung tâm",
    };
  };

  const shippingInfo = getShippingInfoByProvince(formData.province);
  const shippingFee = shippingInfo.fee;
  const totalAmount = getTotalAmount() + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart,
        totalAmount,
        shippingAddress: `${formData.address}, ${formData.district}, ${formData.province}, Việt Nam - ${formData.phone}`,
        paymentMethod,
        paymentInfo: {
          orderInfo: `Thanh toan don hang cua ${formData.fullName} - Phi ship ${shippingFee}d`,
        },
      };

      const response = await orderAPI.create(orderData);

      if (paymentMethod === "vnpay" && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return;
      }

      alert("Đặt hàng thành công!");
      clearCart();
      navigate("/orders");
    } catch (error) {
      alert("Lỗi khi đặt hàng: " + (error.response?.data?.error || error.message));
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
                  Địa chỉ giao hàng tại Việt Nam *
                </label>
                <div className="grid gap-4">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Số nhà, tên đường, phường/xã"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Quận/Huyện"
                    />
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {VIETNAM_PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                Phí ship sẽ tự động tính theo tỉnh/thành đã chọn.
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

              <div>
                <label className="mb-3 block text-sm font-semibold text-stone-700">
                  Phương thức thanh toán
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vnpay")}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                      paymentMethod === "vnpay"
                        ? "border-amber-400 bg-amber-50 ring-4 ring-amber-100"
                        : "border-stone-200 bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">VNPay</p>
                      <p className="text-sm text-stone-500">
                        Thanh toán online
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                      paymentMethod === "cod"
                        ? "border-amber-400 bg-amber-50 ring-4 ring-amber-100"
                        : "border-stone-200 bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-900">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">Tiền mặt</p>
                      <p className="text-sm text-stone-500">
                        Thanh toán khi nhận hàng
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Đang xử lý..."
                  : paymentMethod === "vnpay"
                    ? "Thanh toán bằng VNPay"
                    : "Xác nhận đặt hàng"}
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
                <span>
                  {shippingFee.toLocaleString("vi-VN")}₫ ({shippingInfo.label})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Khu vực</span>
                <span>{formData.province}, Việt Nam</span>
              </div>
              <div className="text-sm text-stone-500">{shippingInfo.note}</div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-stone-950 px-4 py-4 text-white">
              <span className="text-sm uppercase tracking-[0.2em] text-stone-300">
                Tổng
              </span>
              <span className="text-2xl font-black text-amber-300">
                {totalAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
