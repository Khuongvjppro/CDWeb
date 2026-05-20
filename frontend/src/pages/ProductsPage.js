import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { productAPI } from "../utils/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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

  return (
    <div className="page-shell">
      <div className="page-content section-wrap">
        <div className="mb-8">
          <div className="section-heading mb-0">
            <span className="section-kicker">Collections</span>
            <h1 className="title-xl">Khám phá bộ sưu tập cà phê</h1>
            <p className="muted-copy">
              Những loại cà phê được lựa chọn kỹ càng từ những vùng cà phê tốt
              nhất thế giới, mang đến cho bạn hương vị độc đáo và chất lượng cao
              nhất.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="premium-panel h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <Filter size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Bộ lọc</h2>
                <p className="text-sm text-stone-500">Danh mục và tìm kiếm</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Tìm kiếm cà phê..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="newest">Mới Nhất</option>
                <option value="price-low">Giá Thấp Đến Cao</option>
                <option value="price-high">Giá Cao Đến Thấp</option>
                <option value="name">Tên (A-Z)</option>
              </select>
            </div>

            <div className="mt-6 border-t border-stone-200 pt-6">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                Danh mục
              </div>
              <div className="flex flex-wrap gap-3 lg:flex-col">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? "filter-chip-active"
                        : "filter-chip"
                    }
                  >
                    {category.name}
                  </button>
                ))}
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {(() => {
                    const totalPages = Math.max(
                      1,
                      Math.ceil(filteredProducts.length / itemsPerPage),
                    );
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
  );
}
