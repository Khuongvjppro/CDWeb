import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getDefaultImageSrc, getProductImageSrc } from "../utils/productImage";
import { productAPI } from "../utils/api";



const steamStyles = `
  @keyframes steam {
    0% {
      stroke-dashoffset: 0;
      opacity: 0;
      transform: translateY(10px) scaleX(0.85);
    }
    15% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
      transform: translateY(0px) scaleX(1.1);
    }
    100% {
      stroke-dashoffset: -20;
      opacity: 0;
      transform: translateY(-15px) scaleX(0.85);
    }
  }
  .steam-line-1 {
    animation: steam 4s infinite linear;
    stroke-dasharray: 10 15;
    transform-origin: bottom center;
  }
  .steam-line-2 {
    animation: steam 3s infinite linear;
    animation-delay: 1.2s;
    stroke-dasharray: 10 15;
    transform-origin: bottom center;
  }
  .steam-line-3 {
    animation: steam 3.5s infinite linear;
    animation-delay: 2.2s;
    stroke-dasharray: 10 15;
    transform-origin: bottom center;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  .floating-cup {
    animation: float 5s ease-in-out infinite;
  }
  
  @keyframes ripple {
    0% { transform: scale(0.95); opacity: 0.2; }
    50% { transform: scale(1.05); opacity: 0.4; }
    100% { transform: scale(0.95); opacity: 0.2; }
  }
  .shadow-ripple {
    animation: ripple 5s ease-in-out infinite;
  }
`;

const EmptyCartIllustration = () => (
  <div className="relative flex flex-col items-center justify-center py-6">
    <style dangerouslySetInnerHTML={{ __html: steamStyles }} />
    
    <div className="relative h-44 w-44 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7b1e2b]/10 to-[#b55239]/5 blur-xl shadow-ripple" />
      
      <svg className="relative w-36 h-36 floating-cup" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.8">
          <path className="steam-line-1" d="M85 70 Q90 50 82 35 T88 15" stroke="#b55239" strokeWidth="4" strokeLinecap="round"/>
          <path className="steam-line-2" d="M100 70 Q105 50 97 35 T103 15" stroke="#b55239" strokeWidth="4" strokeLinecap="round"/>
          <path className="steam-line-3" d="M115 70 Q120 50 112 35 T118 15" stroke="#b55239" strokeWidth="4" strokeLinecap="round"/>
        </g>
        
        <defs>
          <linearGradient id="cupGrad" x1="50" y1="80" x2="150" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9e2e3c" />
            <stop offset="100%" stopColor="#69141f" />
          </linearGradient>
          <linearGradient id="plateGrad" x1="30" y1="150" x2="170" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d5beaa" />
            <stop offset="100%" stopColor="#a98c73" />
          </linearGradient>
        </defs>
        
        <path d="M142 95 C165 95 168 128 142 133" stroke="url(#cupGrad)" strokeWidth="10" strokeLinecap="round"/>
        <path d="M58 85 L142 85 C142 125 120 148 100 148 C80 148 58 125 58 85 Z" fill="url(#cupGrad)"/>
        <ellipse cx="100" cy="85" rx="42" ry="7" fill="#b55239"/>
        <ellipse cx="100" cy="85" rx="38" ry="4" fill="#3d0b11"/>
        <path d="M40 152 L160 152 C160 162 145 167 100 167 C55 167 40 162 40 152 Z" fill="url(#plateGrad)"/>
        <ellipse cx="100" cy="152" rx="60" ry="5" fill="#fdfcfb" opacity="0.3"/>
        <circle cx="45" cy="40" r="3" fill="#b55239" className="animate-pulse" />
        <circle cx="160" cy="70" r="4" fill="#b55239" className="animate-pulse [animation-delay:1.5s]" />
      </svg>
    </div>
  </div>
);

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalAmount } = useCart();
  const [imgErrors, setImgErrors] = React.useState({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Recommendations state
  const [recommendedProducts, setRecommendedProducts] = React.useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = React.useState(true);
  const [imgErrorsRecommendations, setImgErrorsRecommendations] = React.useState({});
  const [toast, setToast] = React.useState(null);

  const defaultImage = getDefaultImageSrc();
  const totalAmount = getTotalAmount();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const response = await productAPI.getAll();
        if (active && response.data) {
          // Select 3 random products to display as recommendations
          const shuffled = [...response.data].sort(() => 0.5 - Math.random());
          setRecommendedProducts(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        if (active) setLoadingRecommendations(false);
      }
    };

    if (cart.length === 0) {
      fetchRecommendations();
    }
    return () => {
      active = false;
    };
  }, [cart.length]);

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
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#e7d8c9]/70">
                <div>
                  <span className="section-kicker">Premium Cart</span>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-[#5a3e36] sm:text-5xl">
                    Giỏ hàng
                  </h1>
                </div>
                <div className="flex items-center rounded-[1.4rem] border border-[#d8c0a7] bg-white/70 p-2 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7b1e2b] text-xs font-bold text-white">1</div>
                    <span className="text-xs font-bold text-[#7b1e2b]">Giỏ hàng</span>
                  </div>
                  <span className="h-px w-4 bg-[#d4baa0]" />
                  <div className="flex items-center gap-2 px-2 opacity-50">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dcc8b1] bg-[#f5eadc] text-xs font-bold text-[#8a7568]">2</div>
                    <span className="text-xs font-bold text-[#8a7568] hidden sm:inline">Giao hàng</span>
                  </div>
                  <span className="h-px w-4 bg-[#d4baa0]" />
                  <div className="flex items-center gap-2 px-2 opacity-50">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dcc8b1] bg-[#f5eadc] text-xs font-bold text-[#8a7568]">3</div>
                    <span className="text-xs font-bold text-[#8a7568] hidden sm:inline">Hoàn tất</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-[#e7d8c9] bg-white/90 px-6 py-8 text-center shadow-[0_18px_60px_rgba(90,62,54,0.08)]">
                <EmptyCartIllustration />
                
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

              {/* Recommended products block */}
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e7d8c9]" />
                  <h3 className="text-xl font-bold text-[#5a3e36] shrink-0 font-serif">Gợi ý đồ uống cho bạn</h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e7d8c9]" />
                </div>

                {loadingRecommendations ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-[#7b1e2b]" size={28} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {recommendedProducts.map((product) => {
                      const isSale = !!product.sale_price;
                      const displayPrice = (product.sale_price || product.price).toLocaleString("vi-VN");
                      const originalPrice = product.price.toLocaleString("vi-VN");
                      const imgErr = imgErrorsRecommendations[product.id];
                      const imageSrc = imgErr ? defaultImage : getProductImageSrc(product);

                      return (
                        <div key={product.id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e7d8c9]/70 bg-[#faf7f2]/30 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:bg-white/80">
                          {/* Badge */}
                          <div className="absolute left-3 top-3 z-10 rounded-full bg-[#fbf4ea]/90 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#b55239]">
                            {product.category}
                          </div>
                          
                          {/* Image container */}
                          <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#faf8f5] to-[#f4eee6] p-2 mt-2">
                            <img
                              src={imageSrc}
                              alt={product.name}
                              onError={() => setImgErrorsRecommendations(prev => ({ ...prev, [product.id]: true }))}
                              className="h-full max-h-[80px] object-contain transition duration-500 group-hover:scale-105 drop-shadow-[0_6px_12px_rgba(90,62,54,0.12)]"
                            />
                          </div>

                          {/* Info */}
                          <div className="mt-3 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-[#5a3e36] line-clamp-1">{product.name}</h4>
                              <div className="mt-1 flex items-baseline gap-1.5">
                                <span className="text-base font-extrabold text-[#7b1e2b]">{displayPrice}₫</span>
                                {isSale && <span className="text-xs text-stone-400 line-through">{originalPrice}₫</span>}
                              </div>
                            </div>

                            {/* Add to cart btn */}
                            <button
                              onClick={() => {
                                addToCart(product);
                                setToast({ message: `Đã thêm ${product.name} vào giỏ hàng!` });
                                setTimeout(() => setToast(null), 2500);
                              }}
                              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#7b1e2b] py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-[#922a36] active:scale-[0.97]"
                            >
                              <ShoppingCart size={13} />
                              <span>Thêm nhanh</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {toast && (
          <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-stone-900/95 px-6 py-3.5 text-sm font-bold text-white shadow-2xl backdrop-blur animate-bounce">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold">✓</span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="page-shell">
      <div className="page-content section-wrap pt-6 sm:pt-8 lg:pt-10">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-[#d9c2ab] bg-[linear-gradient(145deg,#ead7bb_0%,#f7eddf_48%,#f2e2ce_100%)] px-5 py-10 shadow-[0_28px_70px_rgba(90,62,54,0.14)] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,rgba(123,30,43,0.13)_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full bg-[#7b1e2b]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-72 w-72 rounded-full bg-[#b55239]/10 blur-3xl" />
          <div className="pointer-events-none absolute left-[20%] top-8 h-2.5 w-2.5 rounded-full bg-[#7b1e2b]/25 shadow-[0_0_0_11px_rgba(123,30,43,0.05)]" />
          <div className="pointer-events-none absolute right-7 top-14 h-3 w-3 rounded-full bg-[#7b1e2b]/35 shadow-[0_0_0_15px_rgba(123,30,43,0.06)]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-black tracking-[-0.045em] text-[#5a3e36] sm:text-5xl lg:leading-none">
              Giỏ hàng của bạn
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#715e53] sm:text-base">
              Xem nhanh danh sách món đã chọn, điều chỉnh số lượng và kiểm tra tổng tiền
              trước khi thanh toán. Mọi thay đổi đều cập nhật ngay.
            </p>

            <div className="mx-auto mt-6 flex w-fit max-w-full items-center rounded-[1.4rem] border border-[#d8c0a7] bg-white/70 p-2 shadow-[0_12px_30px_rgba(90,62,54,0.10)] backdrop-blur">
              {["Giao hàng miễn phí", "Thanh toán an toàn", "Hỗ trợ 24/7"].map(
                (label, index) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-2 px-1.5 sm:px-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7b1e2b] text-sm font-bold text-white shadow-[0_8px_18px_rgba(123,30,43,0.22)]">
                        {index + 1}
                      </span>
                      <span className="whitespace-nowrap text-[10px] font-bold text-[#7b1e2b] sm:text-xs">
                        {label}
                      </span>
                    </div>
                    {index < 2 && (
                      <span className="h-px w-4 shrink-0 bg-[#d4baa0] sm:w-8" />
                    )}
                  </React.Fragment>
                )
              )}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/65 px-6 py-5 text-center shadow-[0_14px_32px_rgba(90,62,54,0.09)] backdrop-blur-sm">
                <p className="text-sm font-medium text-[#5a3e36]">Sản phẩm</p>
                <p key={cart.length} className="mt-2 animate-[cartMetric_.35s_ease-out] text-3xl font-black tracking-tight text-[#5a3e36]">{cart.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/65 px-6 py-5 text-center shadow-[0_14px_32px_rgba(90,62,54,0.09)] backdrop-blur-sm">
                <p className="text-sm font-medium text-[#5a3e36]">Số lượng</p>
                <p key={totalItems} className="mt-2 animate-[cartMetric_.35s_ease-out] text-3xl font-black tracking-tight text-[#5a3e36]">{totalItems}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/65 px-6 py-5 text-center shadow-[0_14px_32px_rgba(90,62,54,0.09)] backdrop-blur-sm">
                <p className="text-sm font-medium text-[#5a3e36]">Tạm tính</p>
                <p key={totalAmount} className="mt-2 animate-[cartMetric_.35s_ease-out] text-3xl font-black tracking-tight text-[#7b1e2b]">
                  {totalAmount.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </section>

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
                      {item.price.toLocaleString("vi-VN")} / sản phẩm
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
                        {(item.price * item.quantity).toLocaleString("vi-VN")}
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
                  <span className="font-semibold">{totalAmount.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Giảm giá</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#e2cfb8] pt-4">
                <div className="flex items-center justify-between text-base font-bold text-[#5a3e36]">
                  <span>Tổng cộng</span>
                  <span>{totalAmount.toLocaleString("vi-VN")}</span>
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
