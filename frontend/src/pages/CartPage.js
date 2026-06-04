import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getDefaultImageSrc, getProductImageSrc } from "../utils/productImage";

const EMPTY_STATE_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" fill="none">
    <defs>
      <linearGradient id="g1" x1="96" y1="56" x2="548" y2="356" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFF8F2"/>
        <stop offset="1" stop-color="#F3E6D9"/>
      </linearGradient>
      <linearGradient id="g2" x1="172" y1="106" x2="460" y2="304" gradientUnits="userSpaceOnUse">
        <stop stop-color="#7B1E2B"/>
        <stop offset="1" stop-color="#B55239"/>
      </linearGradient>
    </defs>
    <rect x="24" y="24" width="592" height="372" rx="36" fill="url(#g1)"/>
    <circle cx="514" cy="108" r="54" fill="#E7D8C9" opacity="0.55"/>
    <circle cx="112" cy="306" r="70" fill="#B55239" opacity="0.08"/>
    <path d="M187 150h61l32 120a18 18 0 0 0 17 13h149a18 18 0 0 0 17-13l22-83H255" stroke="#7B1E2B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M232 150l-20-43a12 12 0 0 0-11-7h-36" stroke="#7B1E2B" stroke-width="10" stroke-linecap="round"/>
    <circle cx="282" cy="310" r="18" fill="#7B1E2B"/>
    <circle cx="422" cy="310" r="18" fill="#7B1E2B"/>
    <path d="M310 150c0-27 22-49 49-49s49 22 49 49" stroke="url(#g2)" stroke-width="12" stroke-linecap="round"/>
    <path d="M330 155h57" stroke="#B55239" stroke-width="8" stroke-linecap="round"/>
    <text x="320" y="250" text-anchor="middle" font-size="28" font-weight="700" fill="#5A3E36">Your cart is empty</text>
  </svg>
`)}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalAmount } = useCart();
  const [imgErrors, setImgErrors] = React.useState({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  const defaultImage = getDefaultImageSrc();
  const totalAmount = getTotalAmount();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleImageError = (itemId) => {
    setImgErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    window.setTimeout(() => {
      navigate("/checkout");
    }, 650);
  };

  if (cart.length === 0) {
    return (
      <div className="page-shell">
        <div className="page-content section-wrap pt-6 sm:pt-8 lg:pt-10">
          <div className="mx-auto max-w-3xl">
            <div className="hero-panel-soft relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#b55239]/10 blur-3xl animate-pulse" />
              <div className="pointer-events-none absolute -bottom-8 left-0 h-28 w-28 rounded-full bg-[#5a3e36]/10 blur-3xl animate-pulse [animation-delay:900ms]" />
              <span className="section-kicker">Premium Cart</span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#5a3e36] sm:text-5xl">
                Giỏ hàng
              </h1>
              <div className="mt-8 rounded-[1.75rem] border border-[#e7d8c9] bg-white/90 px-6 py-8 text-center shadow-[0_18px_60px_rgba(90,62,54,0.08)]">
                <div className="mx-auto max-w-sm overflow-hidden rounded-[1.5rem] border border-[#f0e2d7] bg-[#fffaf6] shadow-[0_14px_40px_rgba(90,62,54,0.10)]">
                  <img
                    src={EMPTY_STATE_IMAGE}
                    alt="Giỏ hàng trống"
                    className="h-auto w-full transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>
                <p className="mt-6 text-3xl font-black tracking-tight text-[#5a3e36] sm:text-4xl">
                  Giỏ hàng của bạn đang trống
                </p>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-stone-500 sm:text-lg">
                  Khám phá menu để chọn những món cà phê, trà và đồ uống mát
                  lạnh đang chờ bạn trải nghiệm.
                </p>
                <Link
                  to="/products"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#7b1e2b] px-7 py-3.5 font-semibold text-white shadow-[0_14px_32px_rgba(123,30,43,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#9e3340] hover:shadow-[0_18px_36px_rgba(158,51,64,0.32)]"
                >
                  <span>Khám phá Menu</span>
                  <ArrowLeft size={18} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content section-wrap pt-6 sm:pt-8 lg:pt-10">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[#d9c2ab] bg-[linear-gradient(180deg,#e5cfb0_0%,#f3e3cc_20%,#f4eadb_100%)] px-4 py-6 shadow-[0_28px_70px_rgba(90,62,54,0.16)] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(123,30,43,0.10)_1px,transparent_0)] [background-size:18px_18px]" />
          <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-[#7b1e2b]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-2 top-16 h-3 w-3 rounded-full bg-[#7b1e2b]/40 shadow-[0_0_0_14px_rgba(123,30,43,0.06)]" />
          <div className="pointer-events-none absolute -right-6 bottom-16 h-12 w-12 rounded-full bg-[#b55239]/20 blur-xl" />
          <div className="pointer-events-none absolute left-[20%] top-8 h-2 w-2 rounded-full bg-[#7b1e2b]/30 shadow-[0_0_0_10px_rgba(123,30,43,0.05)]" />

          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h1 className="mt-4 text-3xl font-black tracking-tight text-[#5a3e36] sm:text-4xl lg:text-5xl">
                Giỏ hàng của bạn
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6a584d] sm:text-base lg:text-lg">
                Xem nhanh danh sách món đã chọn, điều chỉnh số lượng và kiểm tra
                tổng tiền trước khi thanh toán. Mọi thay đổi đều cập nhật ngay.
              </p>
              <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#7b1e2b]">
                <span className="rounded-full border border-[#e0c9b2] bg-white/70 px-4 py-2 shadow-[0_8px_18px_rgba(90,62,54,0.08)]">
                  Giao hang mien phi
                </span>
                <span className="rounded-full border border-[#e0c9b2] bg-white/70 px-4 py-2 shadow-[0_8px_18px_rgba(90,62,54,0.08)]">
                  Thanh toan an toan
                </span>
                <span className="rounded-full border border-[#e0c9b2] bg-white/70 px-4 py-2 shadow-[0_8px_18px_rgba(90,62,54,0.08)]">
                  Ho tro 24/7
                </span>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3 lg:mx-auto lg:max-w-4xl">
                <div className="rounded-[1.25rem] border border-[#eadac5] bg-[#f8f2e7] px-4 py-4 shadow-[0_10px_24px_rgba(90,62,54,0.14)]">
                  <div className="text-sm font-medium text-[#5a3e36]">Sản phẩm</div>
                  <div className="mt-2 text-3xl font-black text-[#5a3e36]">{cart.length}</div>
                </div>
                <div className="rounded-[1.25rem] border border-[#eadac5] bg-[#f8f2e7] px-4 py-4 shadow-[0_10px_24px_rgba(90,62,54,0.14)]">
                  <div className="text-sm font-medium text-[#5a3e36]">Số lượng</div>
                  <div className="mt-2 text-3xl font-black text-[#5a3e36]">{totalItems}</div>
                </div>
                <div className="rounded-[1.25rem] border border-[#eadac5] bg-[#f8f2e7] px-4 py-4 shadow-[0_10px_24px_rgba(90,62,54,0.14)]">
                  <div className="text-sm font-medium text-[#5a3e36]">Tạm tính</div>
                  <div className="mt-2 text-3xl font-black text-[#7b1e2b]">{totalAmount.toLocaleString("vi-VN")}₫</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_0.95fr] lg:items-start">
          <div className="grid gap-4 lg:grid-cols-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-[1.4rem] border border-[#efe1cf] bg-[linear-gradient(180deg,#fffaf2_0%,#f7efe2_100%)] p-4 shadow-[0_14px_36px_rgba(90,62,54,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(90,62,54,0.18)]"
              >
                <div className="absolute left-4 top-4 rounded-full border border-[#e8d7c5] bg-[#f6ead8] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b1e2b] shadow-sm">
                  {item.category}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#eadac5] bg-white/90 text-[#7b1e2b] shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#fff0f0]"
                  aria-label={`Xóa ${item.name}`}
                >
                  <Trash2 size={17} />
                </button>

                <div className="flex items-center gap-4 pt-8">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.35rem] border border-[#eadac5] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(243,227,204,0.95),_rgba(225,200,171,0.85))] shadow-[0_14px_28px_rgba(90,62,54,0.14)] transition-transform duration-300 ease-in-out group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                    <div className="absolute -inset-2 rounded-[1.55rem] bg-[radial-gradient(circle_at_top,rgba(123,30,43,0.08),rgba(123,30,43,0.02),transparent_70%)] blur-sm" />
                    <img
                      src={imgErrors[item.id] ? defaultImage : getProductImageSrc(item)}
                      alt={item.name}
                      onError={() => handleImageError(item.id)}
                      className="relative h-full w-full object-contain p-1 drop-shadow-[0_10px_16px_rgba(90,62,54,0.16)]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold text-[#5a3e36] transition-all duration-300 ease-in-out group-hover:text-[#7b1e2b] sm:text-xl">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#7b6a5e]">
                      {item.price.toLocaleString("vi-VN")}₫ / sản phẩm
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-1 rounded-full border border-[#dcc8b1] bg-[#7b1e2b] px-1.5 py-1 text-white shadow-[0_10px_18px_rgba(123,30,43,0.24)]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-white transition-all duration-300 ease-in-out hover:bg-white/12"
                          aria-label={`Giảm số lượng ${item.name}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-9 text-center text-base font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-white transition-all duration-300 ease-in-out hover:bg-white/12"
                          aria-label={`Tăng số lượng ${item.name}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-lg font-black text-[#5a3e36]">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="relative h-fit rounded-[1.75rem] border-2 border-[#7b1e2b] bg-[#fbf4ea] p-5 shadow-[0_18px_42px_rgba(90,62,54,0.18)] lg:sticky lg:top-24">
            <div className="pointer-events-none absolute -right-4 top-6 h-10 w-10 rounded-full bg-[#b55239]/25 blur-xl" />
            <div className="pointer-events-none absolute -left-4 bottom-10 h-14 w-14 rounded-full bg-[#7b1e2b]/10 blur-2xl" />

            <div className="rounded-[1.35rem] border border-[#e5d3c0] bg-[#f8f0e4] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-[#7b1e2b]">
                Order Summary
              </div>
              <h2 className="mt-2 text-center text-2xl font-black text-[#5a3e36]">
                Tóm tắt đơn hàng
              </h2>

              <div className="mt-5 space-y-3 text-sm text-[#5f4e45]">
                <div className="flex items-center justify-between gap-4">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{totalAmount.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Giảm giá</span>
                  <span className="font-semibold">0₫</span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#e2cfb8] pt-4">
                <div className="flex items-center justify-between text-base font-bold text-[#5a3e36]">
                  <span>Tổng cộng</span>
                  <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              <Link
                to="/products"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#b89a78] bg-[#f6ebdd] px-6 py-3 font-semibold text-[#5a3e36] shadow-[0_8px_16px_rgba(90,62,54,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#fbf1e7]"
              >
                Tiếp Tục Mua Sắm
              </Link>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7b1e2b] px-6 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(123,30,43,0.24)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#9b3340] hover:shadow-[0_18px_34px_rgba(123,30,43,0.32)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Đang chuyển đến thanh toán...</span>
                  </>
                ) : (
                  <span>Thanh Toán</span>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
