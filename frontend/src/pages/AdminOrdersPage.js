import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react";
import { authAPI, orderAPI } from "../utils/api";

const formatCurrency = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}`;

const formatDate = (value) =>
  new Date(value || Date.now()).toLocaleDateString("vi-VN");

const getOrderDate = (order) =>
  order.createdAt || order.created_at || order.date || Date.now();

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResponse, usersResponse] = await Promise.all([
        orderAPI.getAll(),
        authAPI.getUsers(),
      ]);

      setOrders(ordersResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.error || "Không thể tải danh sách đơn hàng",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const userMap = useMemo(() => {
    return users.reduce((accumulator, user) => {
      accumulator[user.id] = user;
      return accumulator;
    }, {});
  }, [users]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package className="text-yellow-600" size={18} />;
      case "processing":
        return <Package className="text-blue-600" size={18} />;
      case "shipped":
        return <Truck className="text-purple-600" size={18} />;
      case "delivered":
        return <CheckCircle className="text-green-600" size={18} />;
      case "cancelled":
        return <span className="text-red-600">✕</span>;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ Xử Lý",
      processing: "Đang Xử Lý",
      shipped: "Đã Gửi",
      delivered: "Đã Giao",
      cancelled: "Đã Hủy",
    };
    return labels[status] || status;
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "pending":
        return "admin-chip-active bg-amber-100 text-amber-900 border-amber-200";
      case "processing":
        return "admin-chip-active bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "admin-chip-active bg-violet-100 text-violet-800 border-violet-200";
      case "delivered":
        return "admin-chip-active bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "admin-chip-active bg-red-100 text-red-800 border-red-200";
      default:
        return "admin-chip";
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setError("");
      await orderAPI.updateStatus(id, status);
      setOrders((previous) =>
        previous.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );
    } catch (updateError) {
      setError(
        updateError.response?.data?.error ||
          "Không thể cập nhật trạng thái đơn hàng",
      );
    }
  };

  const toggleOrderDetails = async (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(id);
    if (!orderDetails[id]) {
      try {
        const response = await orderAPI.getById(id);
        setOrderDetails((previous) => ({ ...previous, [id]: response.data }));
      } catch (detailError) {
        setError(
          detailError.response?.data?.error ||
            "Không thể tải chi tiết đơn hàng",
        );
      }
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
              <h1 className="title-xl">Đơn hàng khách hàng</h1>
              <p className="muted-copy mt-2 max-w-2xl">
                Nhận và xử lý đơn hàng thật từ database.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchOrders();
              }}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="admin-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-stone-600">
              Đang tải đơn hàng...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-stone-600">
              Chưa có đơn hàng nào.
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-5">
              {orders.map((order) => {
                const customer = userMap[order.userId];
                const detail = orderDetails[order.id];
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_12px_30px_rgba(32,20,14,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(32,20,14,0.12)]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-amber-50/40"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${getStatusClassName(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-stone-950">
                            Đơn hàng #{order.id}
                          </p>
                          <p className="text-sm text-stone-500">
                            {customer
                              ? `${customer.fullName} · ${customer.email}`
                              : `User ID: ${order.userId}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-black text-stone-950">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span
                          className={`mt-2 ${getStatusClassName(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`text-stone-400 transition ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-stone-200 bg-gradient-to-b from-amber-50/60 to-white p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                            <h3 className="font-bold text-stone-900">
                              Khách hàng
                            </h3>
                            <p className="mt-2 text-sm text-stone-600">
                              {customer ? customer.fullName : "Không xác định"}
                            </p>
                            <p className="text-sm text-stone-500">
                              {customer
                                ? customer.email
                                : `User ID: ${order.userId}`}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                            <h3 className="font-bold text-stone-900">
                              Địa chỉ giao hàng
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-stone-600">
                              {order.shippingAddress || "Chưa có địa chỉ"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                            <h3 className="font-bold text-stone-900">
                              Trạng thái
                            </h3>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-200/60"
                            >
                              <option value="pending">Chờ Xử Lý</option>
                              <option value="processing">Đang Xử Lý</option>
                              <option value="shipped">Đã Gửi</option>
                              <option value="delivered">Đã Giao</option>
                              <option value="cancelled">Đã Hủy</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-bold text-stone-900">
                              Sản phẩm trong đơn
                            </h3>
                            <p className="text-sm text-stone-500">
                              {formatDate(getOrderDate(order))}
                            </p>
                          </div>

                          {detail?.items?.length ? (
                            <div className="space-y-2">
                              {detail.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 text-sm"
                                >
                                  <div>
                                    <p className="font-semibold text-stone-950">
                                      {item.name}
                                    </p>
                                    <p className="text-stone-500">
                                      Số lượng: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-stone-950">
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-stone-500">
                              {detail
                                ? "Đơn này chưa có chi tiết sản phẩm."
                                : "Đang tải chi tiết đơn hàng..."}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
