import React from "react";
import { Mail, MapPin, Phone, Truck, User, Home, Plus } from "lucide-react";
import { VIETNAM_PROVINCES, getDistrictsByProvince, getWardsByDistrict } from "./checkoutData";

const fieldClass =
  "w-full rounded-xl border border-[#e1d1bf] bg-[#fffdfa] px-4 py-3 text-sm text-[#5a3e36] outline-none transition placeholder:text-[#a9978a] hover:border-[#c9ad91] focus:border-[#7b1e2b] focus:ring-4 focus:ring-[#7b1e2b]/10 disabled:opacity-50";

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#6d584c]">
      {children}
    </label>
  );
}

export default function ShippingForm({ formData, onChange, shippingInfo, addressMode, setAddressMode, user }) {
  const districts = getDistrictsByProvince(formData.province);
  const wards = getWardsByDistrict(formData.province, formData.district);

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[#e2cfba] bg-[#fffaf3] shadow-[0_18px_48px_rgba(90,62,54,0.10)]">
      <div className="flex items-center gap-4 border-b border-[#eadbc9] bg-white/65 px-5 py-5 sm:px-7">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7b1e2b] text-white shadow-[0_10px_22px_rgba(123,30,43,0.22)]">
          <MapPin size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#5a3e36]">Thông tin giao hàng</h2>
          <p className="mt-1 text-sm text-[#806d61]">
            Chọn địa chỉ giao hàng và điền thông tin người nhận.
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-7">
        {/* Toggle between default and new address (only shown if user has a default address saved) */}
        {user?.address && (
          <div className="grid grid-cols-2 gap-4 border-b border-[#eadbc9]/50 pb-5">
            <button
              type="button"
              onClick={() => setAddressMode("default")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-300 ${
                addressMode === "default"
                  ? "border-[#7b1e2b] bg-[#7b1e2b]/5 text-[#7b1e2b] font-bold ring-2 ring-[#7b1e2b]/20"
                  : "border-[#e2cfba] bg-white text-[#5a3e36] hover:bg-[#fffcf8]"
              }`}
            >
              <Home size={16} />
              <span className="text-sm">Địa chỉ mặc định</span>
            </button>
            <button
              type="button"
              onClick={() => setAddressMode("new")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-300 ${
                addressMode === "new"
                  ? "border-[#7b1e2b] bg-[#7b1e2b]/5 text-[#7b1e2b] font-bold ring-2 ring-[#7b1e2b]/20"
                  : "border-[#e2cfba] bg-white text-[#5a3e36] hover:bg-[#fffcf8]"
              }`}
            >
              <Plus size={16} />
              <span className="text-sm">Nhập địa chỉ mới</span>
            </button>
          </div>
        )}

        {addressMode === "default" && user?.address ? (
          /* Read-only Default Address View */
          <div className="rounded-2xl border border-[#e5c98f]/60 bg-[#fffdf5] p-5 text-[#5a3e36] shadow-inner">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b55239]">
              <Home size={14} className="animate-pulse" /> Địa chỉ giao hàng mặc định của bạn
            </div>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <span className="w-24 text-xs font-bold uppercase text-stone-400">Người nhận:</span> 
                <span className="font-semibold text-stone-800">{user.fullName}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-24 text-xs font-bold uppercase text-stone-400">Điện thoại:</span> 
                <span className="font-medium text-stone-800">{user.phone || "Chưa cập nhật"}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-24 text-xs font-bold uppercase text-stone-400 mt-0.5">Địa chỉ:</span> 
                <span className="font-medium text-stone-800 flex-1">{user.address}</span>
              </p>
            </div>
          </div>
        ) : (
          /* Edit Form for New Address */
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <FieldLabel>Họ và tên người nhận *</FieldLabel>
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
                <FieldLabel>Email nhận thông báo *</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8779]" size={17} />
                  <input type="email" name="email" value={formData.email} onChange={onChange} required className={`${fieldClass} pl-11`} placeholder="you@example.com" />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>Địa chỉ nhận hàng *</FieldLabel>
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Tỉnh / Thành Phố</span>
                    <select name="province" value={formData.province} onChange={onChange} className={fieldClass}>
                      {VIETNAM_PROVINCES.map((province) => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Quận / Huyện</span>
                    <select name="district" value={formData.district} onChange={onChange} className={fieldClass}>
                      {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Phường / Xã</span>
                    <select name="ward" value={formData.ward} onChange={onChange} className={fieldClass}>
                      {wards.map((ward) => (
                        <option key={ward} value={ward}>{ward}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Địa chỉ chi tiết (Số nhà, tên đường...)</span>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8779]" size={17} />
                    <input type="text" name="addressDetail" value={formData.addressDetail} onChange={onChange} required={addressMode === "new"} className={`${fieldClass} pl-11`} placeholder="Ví dụ: 123 Đường Láng" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-2xl border border-[#e5c98f] bg-[#fff4d8] px-4 py-3.5 text-sm text-[#765526]">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3d99f] text-[#7b1e2b]">
            <Truck size={17} />
          </span>
          <div>
            <p className="font-bold">Phí giao hàng khu vực: {shippingInfo.label}</p>
            <p className="mt-1 text-[#8b6d3e]">
              {shippingInfo.note} · {shippingInfo.fee.toLocaleString("vi-VN")}đ
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
