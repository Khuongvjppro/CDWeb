import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getDefaultImageSrc, getProductImageSrc } from "../utils/productImage";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const imageSrc = getProductImageSrc(product);
  const displayImageSrc = imgError ? getDefaultImageSrc() : imageSrc;

  const displayDescription =
    product.description ||
    "Hương vị cân bằng, hậu vị mượt và phù hợp cho mọi thời điểm trong ngày.";
  const displayPrice = (product.sale_price || product.price).toLocaleString(
    "vi-VN",
  );

  return (
    <div
      onClick={handleCardClick}
      className="group surface-card mx-auto w-full max-w-[22rem] cursor-pointer overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_90px_rgba(88,46,18,0.18)]"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[linear-gradient(160deg,rgba(255,250,244,0.98),rgba(251,191,36,0.2),rgba(120,53,15,0.12))]">
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-amber-900 shadow-sm">
          {product.is_new ? "New" : "Best Seller"}
        </div>
        {product.sale_price && (
          <div className="absolute right-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-white shadow-sm">
            -Ưu đãi
          </div>
        )}
        <img
          src={displayImageSrc}
          alt={product.name || "product"}
          onError={() => setImgError(true)}
          className="max-w-[80%] max-h-[140px] object-contain transition duration-500 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(88,46,18,0.15)]"
        />
      </div>

      <div className="p-4 pb-3 flex items-end justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 mb-0.5">
            {product.category}
          </span>
          <h3 className="text-[1.1rem] font-bold leading-tight text-stone-900 font-serif">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[1.65rem] font-extrabold leading-none text-stone-900">
              {displayPrice}₫
            </span>
            {product.sale_price && (
              <span className="text-[13px] text-stone-400 line-through">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-amber-700"
        >
          <ShoppingCart size={18} />
        </button>
      </div>



    </div>
  );
}
