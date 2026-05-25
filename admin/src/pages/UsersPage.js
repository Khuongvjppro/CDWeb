import React, { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { authAPI } from "../utils/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      [user.fullName, user.email, user.phone, user.role]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(keyword)),
    );
  }, [users, searchTerm]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
          <p className="text-gray-600 mt-2">Danh sách tài khoản được lấy trực tiếp từ database.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <RefreshCw size={18} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>}

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
              {filteredUsers.map((user) => (
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
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Không có khách hàng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
