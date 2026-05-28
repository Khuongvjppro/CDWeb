import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

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

  const defaultImage = `${process.env.PUBLIC_URL || ''}/Image%20product/C%C3%A0%20Ph%C3%AA%20%C4%90en.png`;
  const imageSrc = (product.image || defaultImage);
  const displayImageSrc = imgError ? defaultImage : imageSrc;

  const displayDescription =
    product.description ||
    "Hương vị cân bằng, hậu vị mượt và phù hợp cho mọi thời điểm trong ngày.";
  const displayPrice = (product.sale_price || product.price).toLocaleString(
    "vi-VN",
  );

  return (
    <div 
      onClick={handleCardClick}
      className="group surface-card aspect-[9/11] flex flex-col cursor-pointer overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_90px_rgba(88,46,18,0.18)]"
    >
      <div className="relative flex h-1/2 items-center justify-center overflow-hidden bg-[linear-gradient(160deg,rgba(255,250,244,0.98),rgba(251,191,36,0.2),rgba(120,53,15,0.12))]">
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-900 shadow-sm">
          {product.is_new ? "New" : "Best Seller"}
        </div>
        {product.sale_price && (
          <div className="absolute right-3 top-3 rounded-full bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
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

      <div className="flex h-1/2 flex-col p-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
            {product.category}
          </span>
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
            {product.stock > 0 ? `${product.stock} còn lại` : "Hết hàng"}
          </span>
        </div>

        <h3 className="mb-1 line-clamp-1 text-base font-bold text-stone-900">
          {product.name}
        </h3>
        <p className="mb-2 min-h-[28px] line-clamp-2 text-[12px] leading-4 text-stone-600">
          {displayDescription}
        </p>

        <div className="mb-2 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < 4 ? "fill-amber-400 text-amber-400" : "text-stone-300"
              }
            />
          ))}
          <span className="ml-2 text-[11px] text-stone-500">(4/5)</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-extrabold text-stone-900">
                {displayPrice}₫
              </span>
              {product.sale_price && (
                <span className="text-[11px] text-stone-400 line-through">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-amber-700"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
