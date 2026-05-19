import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, ArrowLeft, RefreshCw } from "lucide-react";
import { productAPI } from "../utils/api";

const initialForm = {
  name: "",
  description: "",
  category: "Cà phê",
  price: "",
  sale_price: "",
  image_url: "",
  stock: "0",
  brand: "Coffee Shop",
  size: "M",
  product_type: "",
  is_featured: false,
  is_new: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const categories = ["Cà phê", "Trà", "Freeze"];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await productAPI.getAll();
      setProducts(response.data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.error || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return products;
    }
    return products.filter((product) => {
      return [
        product.name,
        product.category,
        product.description,
        product.product_type,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(keyword));
    });
  }, [products, searchTerm]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "Cà phê",
      price: String(product.price ?? ""),
      sale_price: product.sale_price !== null && product.sale_price !== undefined ? String(product.sale_price) : "",
      image_url: product.image || "",
      stock: String(product.stock ?? 0),
      brand: product.brand || "Coffee Shop",
      size: product.size || "M",
      product_type: product.product_type || "",
      is_featured: Boolean(product.is_featured),
      is_new: Boolean(product.is_new),
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        price: Number(formData.price),
        sale_price: formData.sale_price === "" ? null : Number(formData.sale_price),
        stock: Number(formData.stock),
      };

      if (editingId) {
        await productAPI.update(editingId, payload);
      } else {
        await productAPI.create(payload);
      }

      await fetchProducts();
      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);
    } catch (submitError) {
      setError(submitError.response?.data?.error || "Không thể lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) {
      return;
    }

    try {
      setError("");
      await productAPI.delete(id);
      await fetchProducts();
    } catch (deleteError) {
      setError(deleteError.response?.data?.error || "Không thể xóa sản phẩm");
    }
  };

  return (
    <div className="page-shell admin-shell">
      <div className="page-content section-wrap py-10">
        <div className="admin-panel-soft mb-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Link to="/admin/dashboard" className="admin-chip-soft">
                  <ArrowLeft size={16} />
                  Quay lại dashboard
                </Link>
              </div>
              <span className="section-kicker">Admin</span>
              <h1 className="title-xl">Quản lý sản phẩm</h1>
              <p className="muted-copy mt-2 max-w-2xl">Thêm, sửa, xóa sản phẩm trực tiếp từ database.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchProducts}
                className="admin-chip-soft"
              >
                <RefreshCw size={16} />
                Làm mới
              </button>
              <button
                type="button"
                onClick={openCreateForm}
                className="btn-primary inline-flex items-center gap-2 px-5 py-3"
              >
                <Plus size={18} />
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>

        <div className="admin-panel mb-6 p-4 sm:p-5">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
            <Search size={18} className="text-stone-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, danh mục, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {showForm && (
          <div className="admin-panel mb-6 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-950">
                  {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <p className="text-sm text-stone-500">
                  Dùng cùng dữ liệu thật trong bảng `products`.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(initialForm);
                }}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-stone-300"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tên sản phẩm"
                required
                className="input-field md:col-span-2"
              />
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả"
                className="input-field md:col-span-2"
              />
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                placeholder="Loại sản phẩm"
                className="input-field"
              />
              <input
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Giá"
                required
                className="input-field"
              />
              <input
                name="sale_price"
                type="number"
                min="0"
                value={formData.sale_price}
                onChange={handleChange}
                placeholder="Giá khuyến mãi"
                className="input-field"
              />
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Ảnh / URL"
                className="input-field"
              />
              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Kho"
                className="input-field"
              />
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Thương hiệu"
                className="input-field"
              />
              <input
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Size"
                className="input-field"
              />

              <label className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
                <input name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} />
                Nổi bật
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
                <input name="is_new" type="checkbox" checked={formData.is_new} onChange={handleChange} />
                Sản phẩm mới
              </label>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(initialForm);
                  }}
                  className="btn-secondary flex-1 py-3"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

          <div className="admin-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-stone-600">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-stone-600">
              Không có sản phẩm nào phù hợp.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Tên</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Danh mục</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Giá</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Kho</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Trạng thái</th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-stone-100 transition hover:bg-amber-50/50 last:border-0">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-950">{product.name}</div>
                        <div className="text-sm text-stone-500">{product.product_type || product.description || "-"}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-600">{product.category || "-"}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-stone-950">
                        {(Number(product.sale_price) || Number(product.price) || 0).toLocaleString("vi-VN")}₫
                        {product.sale_price ? (
                          <div className="text-xs font-normal text-stone-500 line-through">
                            {Number(product.price || 0).toLocaleString("vi-VN")}₫
                          </div>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-600">{product.stock ?? 0}</td>
                      <td className="px-5 py-4 text-sm text-stone-600">
                        <div className="flex flex-wrap gap-2">
                          <span className={product.is_featured ? "admin-chip-active" : "admin-chip"}>
                            {product.is_featured ? "Nổi bật" : "Thường"}
                          </span>
                          {product.is_new ? <span className="admin-chip-active">Mới</span> : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Edit size={16} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
