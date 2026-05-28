import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalAmount, clearCart } =
    useCart();
  const [imgErrors, setImgErrors] = React.useState({});

  const defaultImage = `${process.env.PUBLIC_URL || ''}/Image%20product/C%C3%A0%20Ph%C3%AA%20%C4%90en.png`;

  const handleImageError = (itemId) => {
    setImgErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  if (cart.length === 0) {
    return (
      <div className="page-shell">
        <div className="page-content section-wrap">
          <div className="section-heading">
            <span className="eyebrow">Cart</span>
            <h1 className="title-xl">Giỏ hàng</h1>
          </div>

          <div className="premium-panel flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="text-6xl">🛒</div>
            <p className="mt-5 text-lg font-semibold text-stone-900">
              Giỏ hàng của bạn đang trống
            </p>
            <p className="mt-2 max-w-md text-stone-500">
              Hãy quay lại danh sách sản phẩm để chọn một món cà phê phù hợp với
              tâm trạng hôm nay.
            </p>
            <Link to="/products" className="btn-primary mt-8">
              <ArrowLeft size={18} />
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content section-wrap">
        <div className="hero-panel-soft p-6 sm:p-8">
          <span className="section-kicker">Cart</span>
          <h1 className="title-xl">Giỏ hàng ({cart.length} sản phẩm)</h1>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="premium-panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(255,247,237,0.95),_rgba(251,191,36,0.16),_rgba(120,53,15,0.08))] shadow-inner">
                    <img
                      src={imgErrors[item.id] ? defaultImage : (item.image || defaultImage)}
                      alt={item.name}
                      onError={() => handleImageError(item.id)}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-stone-500">{item.category}</p>
                    <p className="mt-1 text-sm font-semibold text-amber-800">
                      {item.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-amber-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-amber-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="min-w-[96px] text-right">
                    <p className="text-base font-bold text-stone-950">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="premium-panel h-fit lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-stone-900">
              Tóm tắt đơn hàng
            </h2>
            <div className="mt-6 space-y-3 border-b border-stone-200 pb-6 text-stone-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{getTotalAmount().toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá</span>
                <span>0₫</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-lg font-bold text-stone-900">
                Tổng cộng
              </span>
              <span className="text-2xl font-black text-amber-800">
                {getTotalAmount().toLocaleString("vi-VN")}₫
              </span>
            </div>

            <Link to="/checkout" className="btn-primary mt-6 w-full">
              Thanh Toán
            </Link>
            <button
              onClick={() => clearCart()}
              className="btn-secondary mt-3 w-full border-red-200 text-red-700 hover:border-red-300 hover:text-red-800"
            >
              Xóa Giỏ Hàng
            </button>
            <Link to="/products" className="btn-secondary mt-3 w-full">
              Tiếp Tục Mua Sắm
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
