import React from "react";
import { Banknote, Check, CreditCard, ShieldCheck } from "lucide-react";

function MethodCard({ selected, title, description, icon, onClick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`relative flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
        selected
          ? "border-[#7b1e2b] bg-[#fff1ef] shadow-[0_12px_28px_rgba(123,30,43,0.10)]"
          : "border-[#e4d4c2] bg-[#fffdfa] hover:-translate-y-0.5 hover:border-[#c8a98d] hover:shadow-sm"
      }`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selected ? "bg-[#7b1e2b] text-white" : "bg-[#f1e5d7] text-[#7b1e2b]"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-[#5a3e36]">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-[#897568]">{description}</span>
      </span>
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#7b1e2b] bg-[#7b1e2b] text-white" : "border-[#d8c5b1] bg-white"}`}>
        {selected && <Check size={14} />}
      </span>
    </button>
  );
}

export default function PaymentMethod({ selectedMethod, onChange }) {
  return (
    <section className="rounded-[1.75rem] border border-[#e2cfba] bg-[#fffaf3] p-5 shadow-[0_18px_48px_rgba(90,62,54,0.10)] sm:p-7">
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#5a3e36] text-white">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#5a3e36]">Phương thức thanh toán</h2>
          <p className="mt-1 text-sm text-[#806d61]">Mọi giao dịch đều được bảo mật.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Phương thức thanh toán">
        <MethodCard selected={selectedMethod === "vnpay"} title="VNPay" description="Thanh toán online nhanh chóng" icon={<CreditCard size={21} />} onClick={() => onChange("vnpay")} />
        <MethodCard selected={selectedMethod === "cod"} title="Tiền mặt" description="Thanh toán khi nhận hàng" icon={<Banknote size={21} />} onClick={() => onChange("cod")} />
      </div>
    </section>
  );
}
