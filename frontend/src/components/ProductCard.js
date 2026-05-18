import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const displayDescription =
    product.description ||
    "Hương vị cân bằng, hậu vị mượt và phù hợp cho mọi thời điểm trong ngày.";
  const displayPrice = (product.sale_price || product.price).toLocaleString(
    "vi-VN",
  );

  return (
    <div 
      onClick={handleCardClick}
      className="group surface-card cursor-pointer overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_90px_rgba(88,46,18,0.18)]"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[linear-gradient(160deg,rgba(255,250,244,0.98),rgba(251,191,36,0.2),rgba(120,53,15,0.12))]">
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-900 shadow-sm">
          {product.is_new ? "New" : "Best Seller"}
        </div>
        {product.sale_price && (
          <div className="absolute right-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            -Ưu đãi
          </div>
        )}
        <div className="text-6xl transition duration-500 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(88,46,18,0.15)]">
          ☕
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            {product.category}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            {product.stock > 0 ? `${product.stock} còn lại` : "Hết hàng"}
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold text-stone-900">
          {product.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-stone-600">
          {displayDescription}
        </p>

        <div className="mb-4 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < 4 ? "fill-amber-400 text-amber-400" : "text-stone-300"
              }
            />
          ))}
          <span className="ml-2 text-sm text-stone-500">(4/5)</span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-extrabold text-stone-900">
                {displayPrice}₫
              </span>
              {product.sale_price && (
                <span className="text-sm text-stone-400 line-through">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-amber-700"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
