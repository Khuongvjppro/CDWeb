import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import { authAPI } from "../utils/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      setError(
        fetchError.response?.data?.error ||
          "Không thể tải danh sách khách hàng",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
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
              <h1 className="title-xl">Khách hàng</h1>
              <p className="muted-copy mt-2 max-w-2xl">
                Danh sách tài khoản thật lấy trực tiếp từ database.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchUsers();
              }}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Làm mới
            </button>
          </div>
        </div>

        <div className="admin-panel mb-6 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/60">
              <Search size={18} className="text-stone-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between text-sm text-stone-500">
          <span>
            Hiển thị {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            -{Math.min(currentPage * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
          </span>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
        </div>

        <div className="admin-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-stone-600">
              Đang tải khách hàng...
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-stone-200 bg-stone-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                    Tên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                    Điện thoại
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                    Ngày tham gia
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-stone-500"
                    >
                      Không có khách hàng phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-stone-100 transition hover:bg-amber-50/50"
                    >
                      <td className="px-6 py-4 font-semibold text-stone-950">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 text-stone-600">{user.email}</td>
                      <td className="px-6 py-4 text-stone-600">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="admin-chip-soft capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>
                    </tr>
                  ))
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
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trang trước
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition ${page === currentPage ? "bg-amber-600 text-white" : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300"}`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}