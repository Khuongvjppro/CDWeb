import React from "react";
import { Lock, MapPin, Package } from "lucide-react";
import { getDefaultImageSrc, getProductImageSrc } from "../../utils/productImage";

export default function OrderSummary({
  cart,
  subtotal,
  shippingFee,
  shippingInfo,
  province,
  totalAmount,
  paymentMethod,
  loading,
  formId,
}) {
  const [imgErrors, setImgErrors] = React.useState({});
  const defaultImage = getDefaultImageSrc();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const ctaLabel = paymentMethod === "vnpay" ? "Thanh toán bằng VNPay" : "Xác nhận đặt hàng";

  return (
    <aside className="overflow-hidden rounded-[1.75rem] border-2 border-[#7b1e2b] bg-[#fbf4ea] shadow-[0_22px_55px_rgba(90,62,54,0.18)] lg:sticky lg:top-24">
      <div className="bg-[#7b1e2b] px-5 py-5 text-white sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#ead7c9]">Order summary</p>
            <h2 className="mt-1.5 text-2xl font-black">Đơn hàng của bạn</h2>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f3dfc7]">
            <Package size={22} />
          </span>
        </div>
        <p className="mt-3 text-sm text-white/70">{totalItems} sản phẩm đang chờ được giao.</p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="max-h-[310px] space-y-2.5 overflow-y-auto pr-1">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-[#eadac7] bg-white/75 p-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#eadac7] bg-[#f7eddf]">
                <img
                  src={imgErrors[item.id] ? defaultImage : getProductImageSrc(item)}
                  alt={item.name}
                  onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#5a3e36]">{item.name}</p>
                <p className="mt-1 text-xs text-[#927d6f]">Số lượng: {item.quantity}</p>
              </div>
              <p className="shrink-0 text-sm font-black text-[#7b1e2b]">
                {(item.price * item.quantity).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 rounded-2xl border border-[#e5d3bf] bg-[#f7eddf] p-4 text-sm text-[#725f53]">
          <div className="flex justify-between gap-4"><span>Tạm tính</span><strong className="text-[#5a3e36]">{subtotal.toLocaleString("vi-VN")}</strong></div>
          <div className="flex justify-between gap-4"><span>Phí vận chuyển</span><strong className="text-[#5a3e36]">{shippingFee.toLocaleString("vi-VN")}</strong></div>
          <div className="flex items-start gap-2 border-t border-[#dec9b2] pt-3 text-xs leading-5 text-[#806b5e]">
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#7b1e2b]" />
            <span>{province}, Việt Nam · {shippingInfo.label}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-[#5a3e36] px-5 py-4 text-white shadow-[0_14px_30px_rgba(90,62,54,0.22)]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">Tổng thanh toán</p>
            <p className="mt-1 text-xs text-white/60">Đã gồm phí giao hàng</p>
          </div>
          <p className="text-2xl font-black text-[#f4d39a]">{totalAmount.toLocaleString("vi-VN")}</p>
        </div>

        <button
          type="submit"
          form={formId}
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7b1e2b] px-6 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(123,30,43,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96303d] hover:shadow-[0_18px_36px_rgba(123,30,43,0.32)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <Lock size={17} />
          {loading ? "Đang xử lý..." : ctaLabel}
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-[#927d6f]">Thông tin thanh toán được mã hóa và bảo vệ an toàn.</p>
      </div>
    </aside>
  );
}
