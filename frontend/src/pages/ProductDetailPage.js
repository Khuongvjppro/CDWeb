import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, ArrowLeft, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { productAPI } from "../utils/api";
import { getDefaultImageSrc, getProductImageSrc } from "../utils/productImage";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const categoryLabels = {
    "Ca phe sua": "Cà Phê Sữa",
    Espresso: "Espresso",
    Latte: "Latte",
    "Cold Brew": "Cold Brew",
  };

  const imageSrc = getProductImageSrc(product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    setImgError(false);
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      alert("Thêm vào giỏ hàng thành công!");
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="premium-panel">
          <p className="text-stone-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell min-h-screen">
        <div className="page-content section-wrap">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft size={20} />
            <span>Quay Lại</span>
          </button>
          <div className="premium-panel">
            <p className="text-stone-600">Sản phẩm không tìm thấy</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content section-wrap">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-900"
        >
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </button>

        <div className="hero-panel-soft overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="relative min-h-[26rem] bg-[radial-gradient(circle_at_top,_rgba(255,247,237,0.95),_rgba(251,191,36,0.16),_rgba(120,53,15,0.08))] flex items-center justify-center p-10">
              <div className="absolute left-6 top-6 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900 shadow-sm">
                {categoryLabels[product.category] || product.category}
              </div>
              <img
                src={imgError ? getDefaultImageSrc() : imageSrc}
                alt={product.name}
                onError={() => setImgError(true)}
                className="max-w-[90%] max-h-[300px] object-contain drop-shadow-[0_18px_40px_rgba(88,46,18,0.2)]"
              />
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                4.0 / 5.0
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-stone-600">
                {product.description ||
                  "Một sản phẩm cà phê được cân chỉnh để phù hợp với phong cách thưởng thức hiện đại, cân bằng giữa hương và hậu vị."}
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Giá hiện tại
                  </div>
                  <div className="mt-1 text-4xl font-black text-stone-950">
                    {product.price.toLocaleString("vi-VN")}₫
                  </div>
                </div>
                <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-600">
                  {product.stock > 0
                    ? `Còn ${product.stock} sản phẩm`
                    : "Hết hàng"}
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Số lượng
                  </p>
                  <div className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white px-3 py-2 shadow-sm">
                    <button
                      onClick={decreaseQuantity}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-amber-100"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 text-center text-xl font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-amber-100"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="surface-card-soft p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Thông tin
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-stone-500">Xuất xứ</p>
                      <p className="font-semibold text-stone-900">Việt Nam</p>
                    </div>
                    <div>
                      <p className="text-stone-500">Loại</p>
                      <p className="font-semibold text-stone-900">
                        {categoryLabels[product.category] || product.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary mt-8 w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart size={20} />
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
