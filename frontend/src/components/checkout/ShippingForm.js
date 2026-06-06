import React from "react";
import { Mail, MapPin, Phone, Truck, User } from "lucide-react";
import { VIETNAM_PROVINCES } from "./checkoutData";

const fieldClass =
  "w-full rounded-xl border border-[#e1d1bf] bg-[#fffdfa] px-4 py-3 text-sm text-[#5a3e36] outline-none transition placeholder:text-[#a9978a] hover:border-[#c9ad91] focus:border-[#7b1e2b] focus:ring-4 focus:ring-[#7b1e2b]/10";

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#6d584c]">
      {children}
    </label>
  );
}

export default function ShippingForm({ formData, onChange, shippingInfo }) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[#e2cfba] bg-[#fffaf3] shadow-[0_18px_48px_rgba(90,62,54,0.10)]">
      <div className="flex items-center gap-4 border-b border-[#eadbc9] bg-white/65 px-5 py-5 sm:px-7">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7b1e2b] text-white shadow-[0_10px_22px_rgba(123,30,43,0.22)]">
          <MapPin size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#5a3e36]">Thông tin giao hàng</h2>
          <p className="mt-1 text-sm text-[#806d61]">
            Điền chính xác để đơn hàng được giao nhanh chóng.
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-7">
        <div>
          <FieldLabel>Họ và tên *</FieldLabel>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8779]" size={17} />
            <input type="text" name="fullName" value={formData.fullName} onChange={onChange} required className={`${fieldClass} pl-11`} placeholder="Nguyễn Văn An" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Số điện thoại *</FieldLabel>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8779]" size={17} />
              <input type="tel" name="phone" value={formData.phone} onChange={onChange} required className={`${fieldClass} pl-11`} placeholder="0xx xxx xxxx" />
            </div>
          </div>
          <div>
            <FieldLabel>Email *</FieldLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8779]" size={17} />
              <input type="email" name="email" value={formData.email} onChange={onChange} required className={`${fieldClass} pl-11`} placeholder="you@example.com" />
            </div>
          </div>
        </div>

        <div>
          <FieldLabel>Địa chỉ nhận hàng *</FieldLabel>
          <div className="grid gap-3">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8779]" size={17} />
              <input type="text" name="address" value={formData.address} onChange={onChange} required className={`${fieldClass} pl-11`} placeholder="Số nhà, tên đường, phường/xã" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="text" name="district" value={formData.district} onChange={onChange} className={fieldClass} placeholder="Quận/Huyện" />
              <select name="province" value={formData.province} onChange={onChange} className={fieldClass}>
                {VIETNAM_PROVINCES.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-[#e5c98f] bg-[#fff4d8] px-4 py-3.5 text-sm text-[#765526]">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3d99f] text-[#7b1e2b]">
            <Truck size={17} />
          </span>
          <div>
            <p className="font-bold">Phí giao hàng được cập nhật theo khu vực</p>
            <p className="mt-1 text-[#8b6d3e]">
              {shippingInfo.note} · {shippingInfo.fee.toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div>
          <FieldLabel>Ghi chú đơn hàng</FieldLabel>
          <textarea name="notes" value={formData.notes} onChange={onChange} rows="3" className={fieldClass} placeholder="Ví dụ: Gọi trước khi giao, ít đá..." />
        </div>
      </div>
    </section>
  );
}
