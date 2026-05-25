import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, RefreshCw } from "lucide-react";
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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

    return products.filter((product) =>
      [product.name, product.category, product.description, product.product_type]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(keyword)),
    );
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
    setFormData((previous) => ({
      ...previous,
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">Dữ liệu được lấy trực tiếp từ database qua API.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <RefreshCw size={18} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={openCreateForm}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Plus size={20} />
            <span>Thêm Sản Phẩm</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{editingId ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData(initialForm); }} className="text-gray-500 hover:text-gray-900">Đóng</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input name="name" type="text" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} required className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="description" type="text" placeholder="Mô tả" value={formData.description} onChange={handleChange} className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg" />
            <select name="category" value={formData.category} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg">
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input name="product_type" type="text" placeholder="Loại sản phẩm" value={formData.product_type} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="price" type="number" min="0" placeholder="Giá" value={formData.price} onChange={handleChange} required className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="sale_price" type="number" min="0" placeholder="Giá khuyến mãi" value={formData.sale_price} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="image_url" type="text" placeholder="Ảnh / URL" value={formData.image_url} onChange={handleChange} className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="stock" type="number" min="0" placeholder="Kho hàng" value={formData.stock} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="brand" type="text" placeholder="Thương hiệu" value={formData.brand} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="size" type="text" placeholder="Size" value={formData.size} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg" />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} />
              Nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input name="is_new" type="checkbox" checked={formData.is_new} onChange={handleChange} />
              Mới
            </label>
            <div className="col-span-2 flex space-x-4">
              <button type="submit" disabled={saving} className="flex-1 bg-green-600 disabled:bg-gray-400 text-white py-2 rounded-lg transition">{saving ? "Đang lưu..." : "Lưu"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData(initialForm); }} className="flex-1 bg-gray-400 text-white py-2 rounded-lg transition">Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Đang tải sản phẩm...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Danh Mục</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kho</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.product_type || product.description || ""}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{Number(product.price || 0).toLocaleString("vi-VN")}₫</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button onClick={() => openEditForm(product)} className="text-blue-600 hover:text-blue-700" title="Sửa">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700" title="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Không có sản phẩm phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
