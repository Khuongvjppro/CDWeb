import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../utils/api";
import CheckoutLayout from "../components/checkout/CheckoutLayout";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import { getShippingInfoByProvince } from "../components/checkout/checkoutData";

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

  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (cart.length === 0) return <Navigate to="/cart" />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const shippingInfo = getShippingInfoByProvince(formData.province);
  const shippingFee = shippingInfo.fee;
  const subtotal = getTotalAmount();
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await orderAPI.create({
        items: cart,
        totalAmount,
        shippingAddress: `${formData.address}, ${formData.district}, ${formData.province}, Việt Nam - ${formData.phone}`,
        paymentMethod,
        paymentInfo: {
          orderInfo: `Thanh toan don hang cua ${formData.fullName} - Phi ship ${shippingFee}d`,
        },
      });

      if (paymentMethod === "vnpay" && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return;
      }

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
    <CheckoutLayout
      title="Thanh toán đơn hàng"
      subtitle="Chỉ còn một bước để những món đồ uống yêu thích được giao tận tay bạn."
      stepper={<CheckoutStepper currentStep={2} />}
      summary={
        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          shippingFee={shippingFee}
          shippingInfo={shippingInfo}
          province={formData.province}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          loading={loading}
          formId="checkout-form"
        />
      }
    >
      <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
        <ShippingForm formData={formData} onChange={handleChange} shippingInfo={shippingInfo} />
        <PaymentMethod selectedMethod={paymentMethod} onChange={setPaymentMethod} />
      </form>
    </CheckoutLayout>
  );
}
