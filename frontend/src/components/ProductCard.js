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

  const displayPrice = (product.sale_price || product.price).toLocaleString(
    "vi-VN",
  );

  return (
    <div
      onClick={handleCardClick}
      className="group mx-auto w-full max-w-[22rem] cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(88,46,18,0.16)] rounded-[2.25rem] border border-[#e7d8c9]/50 bg-[#faf7f2]/30 backdrop-blur-sm"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffdf6] via-[#faf2e0] to-[#eaddca]">
        <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-1.5 text-[12px] font-semibold font-serif tracking-wide text-[#85533f] shadow-sm">
          {product.is_new ? "New" : "Best Seller"}
        </div>
        {product.sale_price && (
          <div className="absolute right-5 top-5 rounded-full bg-[#b55239] px-4 py-1.5 text-[11px] font-semibold font-serif tracking-wide text-white shadow-sm">
            -Ưu đãi
          </div>
        )}
        <img
          src={displayImageSrc}
          alt={product.name || "product"}
          onError={() => setImgError(true)}
          className="max-w-[75%] max-h-[145px] object-contain transition duration-700 ease-out group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(88,46,18,0.15)]"
        />
      </div>

      <div className="p-6 pt-5 pb-6 bg-[#fcfaf7] flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b55239] font-serif mb-1">
            {product.category}
          </span>
          <h3 className="text-[1.25rem] font-bold leading-snug text-[#2c221e] font-serif tracking-tight">
            {product.name}
          </h3>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2c221e] font-serif tracking-tight leading-none">
              {displayPrice}
            </span>
            {product.sale_price && (
              <span className="text-sm text-stone-400 line-through leading-none font-serif ml-1.5">
                {product.price.toLocaleString("vi-VN")}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#110f0e] text-white shadow-lg shadow-[#110f0e]/10 transition duration-300 hover:-translate-y-1 hover:bg-[#b55239] active:scale-95"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
}
