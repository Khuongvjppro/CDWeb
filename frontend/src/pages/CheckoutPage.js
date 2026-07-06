import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../utils/api";
import CheckoutLayout from "../components/checkout/CheckoutLayout";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import { CheckCircle, AlertCircle } from "lucide-react";
import { 
  getShippingInfoByProvince, 
  VIETNAM_PROVINCES, 
  getDistrictsByProvince, 
  getWardsByDistrict 
} from "../components/checkout/checkoutData";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, getTotalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const hasDefaultAddress = !!user?.address;
  const [addressMode, setAddressMode] = useState(hasDefaultAddress ? "default" : "new");

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    addressDetail: "",
    ward: "Phường Hàng Bạc",
    district: "Quận Hoàn Kiếm",
    province: "Hà Nội",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
      if (user.address && !formData.addressDetail) {
        setAddressMode("default");
      }
    }
  }, [user]);

  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (cart.length === 0) return <Navigate to="/cart" />;

  const handleProvinceChange = (provinceName) => {
    const districts = getDistrictsByProvince(provinceName);
    const defaultDistrict = districts[0] || "";
    const wards = getWardsByDistrict(provinceName, defaultDistrict);
    const defaultWard = wards[0] || "";

    setFormData((prev) => ({
      ...prev,
      province: provinceName,
      district: defaultDistrict,
      ward: defaultWard,
    }));
  };

  const handleDistrictChange = (districtName) => {
    const wards = getWardsByDistrict(formData.province, districtName);
    const defaultWard = wards[0] || "";

    setFormData((prev) => ({
      ...prev,
      district: districtName,
      ward: defaultWard,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      handleProvinceChange(value);
    } else if (name === "district") {
      handleDistrictChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Phát hiện Tỉnh thành trong địa chỉ mặc định để tự động tính phí ship
  const detectProvince = (addressStr) => {
    if (!addressStr) return "Hà Nội";
    for (const prov of VIETNAM_PROVINCES) {
      if (addressStr.toLowerCase().includes(prov.toLowerCase())) {
        return prov;
      }
    }
    return "Hà Nội";
  };

  const currentProvince = addressMode === "default"
    ? detectProvince(user?.address)
    : formData.province;

  const shippingInfo = getShippingInfoByProvince(currentProvince);
  const shippingFee = shippingInfo.fee;
  const subtotal = getTotalAmount();
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const shippingAddress = addressMode === "default"
      ? `${user?.address}, Việt Nam`
      : `${formData.addressDetail}, ${formData.ward}, ${formData.district}, ${formData.province}, Việt Nam`;

    const recipientName = addressMode === "default" ? user?.fullName : formData.fullName;
    const recipientPhone = addressMode === "default" ? user?.phone : formData.phone;

    try {
      const response = await orderAPI.create({
        items: cart,
        totalAmount,
        shippingAddress: `${shippingAddress} - Người nhận: ${recipientName} (${recipientPhone})`,
        paymentMethod,
        paymentInfo: {
          orderInfo: `Thanh toan don hang cua ${recipientName} - Phi ship ${shippingFee}d`,
        },
      });

      if (paymentMethod === "vnpay" && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return;
      }

      setShowSuccessModal(true);
    } catch (error) {
      setModalErrorMessage(error.response?.data?.error || error.message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            province={currentProvince}
            totalAmount={totalAmount}
            paymentMethod={paymentMethod}
            loading={loading}
            formId="checkout-form"
          />
        }
      >
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
          <ShippingForm 
            formData={formData} 
            onChange={handleChange} 
            shippingInfo={shippingInfo} 
            addressMode={addressMode}
            setAddressMode={setAddressMode}
            user={user}
          />
          <PaymentMethod selectedMethod={paymentMethod} onChange={setPaymentMethod} />
        </form>
      </CheckoutLayout>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/80 bg-white/95 p-8 text-center shadow-[0_24px_70px_rgba(90,62,54,0.3)] backdrop-blur-xl animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
              <CheckCircle size={42} className="animate-bounce" />
            </div>
            <h3 className="mt-6 text-2xl font-black text-[#5a3e36]">Đặt Hàng Thành Công!</h3>
            <p className="mt-3 text-sm text-stone-500 leading-relaxed">
              Cảm ơn bạn đã tin tưởng và lựa chọn **CoffeeShop**! Ly cà phê thơm ngon đậm vị của bạn đang được chuẩn bị giao đi.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                clearCart();
                navigate("/orders");
              }}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#5a3e36] to-[#b55239] py-4 text-sm font-bold text-white shadow-md shadow-[#5a3e36]/10 transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
            >
              Xem lịch sử đơn hàng
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/80 bg-white/95 p-8 text-center shadow-[0_24px_70px_rgba(90,62,54,0.3)] backdrop-blur-xl animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-inner">
              <AlertCircle size={42} />
            </div>
            <h3 className="mt-6 text-2xl font-black text-[#5a3e36]">Đặt Hàng Thất Bại</h3>
            <p className="mt-3 text-sm text-red-700 font-medium bg-red-50/50 p-3.5 rounded-2xl border border-red-100/50 leading-relaxed">
              {modalErrorMessage}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-8 w-full rounded-2xl border border-stone-200 bg-stone-100 py-4 text-sm font-bold text-[#5a3e36] transition hover:bg-stone-200 active:scale-[0.99]"
            >
              Đóng và thử lại
            </button>
          </div>
        </div>
      )}
    </>
  );
}
