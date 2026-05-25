import React, { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { authAPI } from "../utils/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authAPI.getUsers();
      setUsers(response.data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.error || "Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchesKeyword =
        !keyword ||
        [user.fullName, user.email, user.phone, user.role]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(keyword));
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesKeyword && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-8">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-900 to-stone-800 p-6 text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Khách Hàng</h1>
          <p className="mt-2 text-amber-100">Danh sách tài khoản được lấy trực tiếp từ database.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1.5fr_0.8fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={fetchUsers}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <RefreshCw size={18} />
          <span>Làm mới</span>
        </button>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>}

      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Hiển thị {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          -{Math.min(currentPage * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
        </span>
        <span>Trang {currentPage} / {totalPages}</span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Đang tải khách hàng...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Điện Thoại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vai Trò</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày Tham Gia</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "-"}</td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Không có khách hàng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trang trước
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${page === currentPage ? "bg-amber-600 text-white" : "border border-gray-200 bg-white text-gray-700"}`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}
