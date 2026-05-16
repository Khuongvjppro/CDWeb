import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI } from '../utils/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'Ca phe sua', name: 'Cà Phê Sữa' },
    { id: 'Espresso', name: 'Espresso' },
    { id: 'Latte', name: 'Latte' },
    { id: 'Cold Brew', name: 'Cold Brew' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="page-shell">
      <div className="page-content section-wrap">
        <div className="section-heading">
          <span className="eyebrow">Collections</span>
          <h1 className="title-xl">Cửa hàng cà phê</h1>
          <p className="muted-copy">Không gian mua sắm với sidebar gọn, ô tìm kiếm nổi bật và product cards sang hơn để bạn nhìn là muốn bấm.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="surface-card-soft h-fit p-6 lg:sticky lg:top-24">
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
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">Danh mục</div>
              <div className="flex flex-wrap gap-3 lg:flex-col">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'filter-chip-active' : 'filter-chip'}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="surface-card-soft flex items-center justify-center py-20">
                <p className="text-stone-600">Đang tải sản phẩm...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="surface-card-soft flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl">☕</div>
                <p className="mt-4 text-lg font-semibold text-stone-900">Không tìm thấy sản phẩm</p>
                <p className="mt-2 text-stone-500">Hãy thử đổi từ khóa hoặc danh mục khác.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
