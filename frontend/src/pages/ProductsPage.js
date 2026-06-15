import React, { useState, useEffect } from "react";
import { Filter, Search, SlidersHorizontal, ChevronDown, Coffee, Leaf, Snowflake, Grid, X, RotateCcw } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { productAPI } from "../utils/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = [
    { id: "all", name: "Tất Cả" },
    { id: "Cà phê", name: "Cà Phê" },
    { id: "Trà", name: "Trà" },
    { id: "Freeze", name: "Freeze" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return products.length;
    return products.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="page-shell overflow-visible">
      <div className="page-content">
        <div className="w-full border-b border-[#e7d8c9]/70 bg-[#f7e7d7]">
          <div className="relative w-full overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
              <img
                src="/banner/Thực đơn.png"
                alt="Thuc don"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative max-w-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7b1e2b] to-[#b55239] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-md">
                  ☕ Thực Đơn
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-[#7b1e2b]/40 to-transparent"></div>
              </div>
              
              <h1 
                className="mt-3 text-3xl font-extrabold tracking-tight text-[#3f2f29] sm:text-4xl"
                style={{ textShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)' }}
              >
                Chọn món yêu thích của bạn
              </h1>
              
              <p 
                className="mt-2 text-base font-bold leading-relaxed text-[#4a332d]"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.8)' }}
              >
                Từ cà phê rang đậm đến trà thanh nhẹ và thức uống mát lạnh, mọi
                lựa chọn đều được pha chế tươi mới để bạn thưởng thức trọn vẹn.
              </p>
            </div>
          </div>
        </div>

        <div className="section-wrap">
          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit lg:sticky lg:top-24 rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[0_20px_50px_rgba(90,62,54,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_25px_60px_rgba(90,62,54,0.1)] hover:bg-white/50">
              <div className="flex items-center justify-between pb-4 border-b border-[#e7d8c9]/40">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#5a3e36]/5 text-[#5a3e36] transition-transform duration-300 hover:rotate-12">
                    <Filter size={16} />
                  </div>
                  <div>
                    <h2 className="text-md font-extrabold tracking-tight text-[#5a3e36]">Bộ lọc</h2>
                    <p className="text-[11px] text-[#5a3e36]/60 font-medium">Danh mục & tìm kiếm</p>
                  </div>
                </div>
                {(selectedCategory !== "all" || searchTerm !== "" || sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                      setSortBy("newest");
                    }}
                    className="text-xs font-semibold text-[#b55239] hover:text-[#8f3b2c] flex items-center gap-1 transition-all duration-300 hover:underline"
                  >
                    <RotateCcw size={12} />
                    Đặt lại
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5a3e36]/50 uppercase tracking-wider mb-2">
                    Tìm kiếm sản phẩm
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#5a3e36]/60 group-focus-within:text-[#b55239] transition-colors duration-300">
                      <Search size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Tìm kiếm cà phê..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-white/80 bg-white/40 pl-10 pr-8 py-2.5 text-sm text-[#5a3e36] placeholder-[#5a3e36]/40 outline-none transition-all duration-300 focus:border-[#b55239] focus:bg-white/85 focus:ring-4 focus:ring-[#b55239]/5"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-stone-400 hover:text-[#b55239] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5a3e36]/50 uppercase tracking-wider mb-2">
                    Sắp xếp theo
                  </label>
                  <div className="relative z-20">
                    <button
                      type="button"
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="w-full flex items-center justify-between rounded-xl border border-white/80 bg-white/40 pl-10 pr-4 py-2.5 text-sm text-[#5a3e36] outline-none transition-all duration-300 hover:bg-white/60 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5 text-left"
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#5a3e36]/60">
                        <SlidersHorizontal size={14} />
                      </span>
                      <span>
                        {sortBy === "newest" && "Mới Nhất"}
                        {sortBy === "price-low" && "Giá Thấp Đến Cao"}
                        {sortBy === "price-high" && "Giá Cao Đến Thấp"}
                        {sortBy === "name" && "Tên (A-Z)"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-[#5a3e36]/60 transition-transform duration-300 ${
                          isSortOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isSortOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsSortOpen(false)}
                        />
                        <div className="absolute right-0 left-0 mt-2 z-20 rounded-2xl border border-white/80 bg-white/95 p-1.5 shadow-[0_15px_40px_rgba(90,62,54,0.15)] backdrop-blur-md overflow-hidden transition-all duration-300">
                          {[
                            { value: "newest", label: "Mới Nhất" },
                            { value: "price-low", label: "Giá Thấp Đến Cao" },
                            { value: "price-high", label: "Giá Cao Đến Thấp" },
                            { value: "name", label: "Tên (A-Z)" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSortBy(option.value);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                                sortBy === option.value
                                  ? "bg-[#b55239] text-white font-bold"
                                  : "text-[#5a3e36]/80 hover:bg-[#5a3e36]/5 hover:text-[#5a3e36]"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#e7d8c9]/40 pt-5">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#5a3e36]/50">
                  Danh mục sản phẩm
                </div>
                <div className="space-y-1.5">
                  {categories.map((category) => {
                    const isActive = selectedCategory === category.id;
                    let IconComponent = Coffee;
                    if (category.id === "all") IconComponent = Grid;
                    else if (category.id === "Trà") IconComponent = Leaf;
                    else if (category.id === "Freeze") IconComponent = Snowflake;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(isActive ? "all" : category.id)}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#b55239] to-[#c2624b] text-white shadow-md shadow-[#b55239]/20 font-bold scale-[1.02]"
                            : "text-[#5a3e36]/80 hover:bg-white/60 hover:text-stone-900 hover:translate-x-1"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#5a3e36]/5 text-[#5a3e36]/70 group-hover:bg-[#5a3e36]/10"
                            }`}
                          >
                            <IconComponent size={15} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "animate-pulse" : ""}`} />
                          </div>
                          <span className="transition-colors duration-300">{category.name}</span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-white/20 text-white font-semibold"
                              : "bg-[#5a3e36]/5 text-[#5a3e36]/60 group-hover:bg-[#5a3e36]/10"
                          }`}
                        >
                          {getCategoryCount(category.id)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <section>
              {loading ? (
                <div className="premium-panel flex items-center justify-center py-20">
                  <p className="text-stone-600">Đang tải sản phẩm...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(() => {
                      const start = (currentPage - 1) * itemsPerPage;
                      const pageItems = filteredProducts.slice(
                        start,
                        start + itemsPerPage,
                      );
                      return pageItems.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={addToCart}
                        />
                      ));
                    })()}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2">
                    {(() => {
                      const totalPages = Math.max(
                        1,
                        Math.ceil(filteredProducts.length / itemsPerPage),
                      );
                      const pages = [];
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                      return (
                        <div className="inline-flex items-center gap-2">
                          <button
                            className="btn-secondary px-3 py-1"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>

                          {pages.map((p) => (
                            <button
                              key={p}
                              onClick={() => setCurrentPage(p)}
                              className={
                                p === currentPage
                                  ? "btn-primary px-3 py-1"
                                  : "btn-outline px-3 py-1"
                              }
                            >
                              {p}
                            </button>
                          ))}

                          <button
                            className="btn-secondary px-3 py-1"
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="premium-panel flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl">☕</div>
                  <p className="mt-4 text-lg font-semibold text-stone-900">
                    Không tìm thấy sản phẩm
                  </p>
                  <p className="mt-2 text-stone-500">
                    Hãy thử đổi từ khóa hoặc danh mục khác.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
