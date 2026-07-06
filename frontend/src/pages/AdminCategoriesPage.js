import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, ArrowLeft, RefreshCw, Folder } from "lucide-react";
import { categoryAPI } from "../utils/api";

const initialForm = {
  name: "",
  description: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.error || "Không thể tải danh sách danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Tên danh mục không được để trống!");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await categoryAPI.update(editingId, formData);
        setSuccess("Cập nhật danh mục thành công!");
      } else {
        await categoryAPI.create(formData);
        setSuccess("Tạo danh mục mới thành công!");
      }

      await fetchCategories();
      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialForm);
        setSuccess("");
      }, 1500);
    } catch (submitError) {
      setError(submitError.response?.data?.error || "Không thể lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa danh mục này? Điều này có thể ảnh hưởng đến sản phẩm liên quan.")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await categoryAPI.delete(id);
      setSuccess("Xóa danh mục thành công!");
      await fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (deleteError) {
      setError(deleteError.response?.data?.error || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="page-shell admin-shell">
      <div className="page-content section-wrap py-10">
        {/* Page Header */}
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
              <h1 className="title-xl">Quản lý danh mục</h1>
              <p className="muted-copy mt-2 max-w-2xl">
                Cấu hình danh mục đồ uống và đồ ăn nhẹ để gán cho sản phẩm.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchCategories}
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
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 shadow-sm animate-in fade-in duration-200">
            {success}
          </div>
        )}

        {/* Add/Edit Form Panel */}
        {showForm && (
          <div className="admin-panel mb-6 p-6 animate-in slide-in-from-top-4 duration-300">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-950">
                  {editingId ? "Sửa danh mục" : "Thêm danh mục mới"}
                </h2>
                <p className="text-sm text-stone-500">
                  Nhập thông tin danh mục tương ứng trong database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(initialForm);
                  setError("");
                  setSuccess("");
                }}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-stone-300"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Tên danh mục *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên danh mục (Ví dụ: Freeze, Trà, Bánh ngọt...)"
                  required
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Mô tả danh mục
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả tóm tắt cho nhóm sản phẩm này..."
                  rows="3"
                  className="input-field w-full p-3.5 min-h-[90px] rounded-2xl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : editingId ? "Cập nhật danh mục" : "Tạo danh mục mới"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(initialForm);
                    setError("");
                    setSuccess("");
                  }}
                  className="btn-secondary flex-1 py-3.5"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List View */}
        <div className="admin-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-stone-600 flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#5a3e36] border-t-transparent" />
              <span>Đang tải danh sách danh mục...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-stone-600">
              Không có danh mục nào tồn tại.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-stone-100 transition hover:bg-amber-50/50 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-stone-900">
                        #{category.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-[#b55239]">
                            <Folder size={16} />
                          </div>
                          <span className="font-bold text-stone-950">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600 max-w-xs truncate">
                        {category.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(category)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Edit size={13} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={13} />
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
