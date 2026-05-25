import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Truck, Package, RefreshCw } from "lucide-react";
import { authAPI, orderAPI } from "../utils/api";

const formatCurrency = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}₫`;
const formatDate = (value) => new Date(value || Date.now()).toLocaleDateString("vi-VN");
const getOrderDate = (order) => order.createdAt || order.created_at || order.date || Date.now();

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);
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
      setError(fetchError.response?.data?.error || "Không thể tải danh sách đơn hàng");
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

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-900",
      processing: "bg-blue-100 text-blue-900",
      shipped: "bg-purple-100 text-purple-900",
      delivered: "bg-green-100 text-green-900",
      cancelled: "bg-red-100 text-red-900",
    };
    return colors[status] || "bg-gray-100 text-gray-900";
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setError("");
      await orderAPI.updateStatus(id, status);
      setOrders((previous) => previous.map((order) => (order.id === id ? { ...order, status } : order)));
    } catch (updateError) {
      setError(updateError.response?.data?.error || "Không thể cập nhật trạng thái đơn hàng");
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
        setError(detailError.response?.data?.error || "Không thể tải chi tiết đơn hàng");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
          <p className="text-gray-600 mt-2">Danh sách đơn lấy trực tiếp từ database.</p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          <span>Làm mới</span>
        </button>
      </div>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Chưa có đơn hàng nào.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mã Đơn</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Khách Hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số Tiền</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customer = userMap[order.userId];
                const detail = orderDetails[order.id];
                const isExpanded = expandedOrderId === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{customer ? `${customer.fullName} · ${customer.email}` : `User ID: ${order.userId}`}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(getOrderDate(order))}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-3">
                        <button onClick={() => toggleOrderDetails(order.id)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td colSpan="6" className="px-6 py-5">
                          <div className="grid gap-4 md:grid-cols-3 mb-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h3 className="font-semibold text-gray-900">Khách hàng</h3>
                              <p className="text-sm text-gray-600 mt-2">{customer ? customer.fullName : "Không xác định"}</p>
                              <p className="text-sm text-gray-500">{customer ? customer.email : `User ID: ${order.userId}`}</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h3 className="font-semibold text-gray-900">Địa chỉ giao hàng</h3>
                              <p className="text-sm text-gray-600 mt-2">{order.shippingAddress || "Chưa có địa chỉ"}</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h3 className="font-semibold text-gray-900">Trạng thái</h3>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-600"
                              >
                                <option value="pending">Chờ Xử Lý</option>
                                <option value="processing">Đang Xử Lý</option>
                                <option value="shipped">Đã Gửi</option>
                                <option value="delivered">Đã Giao</option>
                                <option value="cancelled">Đã Hủy</option>
                              </select>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Sản phẩm trong đơn</h3>
                            {detail?.items?.length ? (
                              <div className="space-y-2">
                                {detail.items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                                    <div>
                                      <p className="font-semibold text-gray-900">{item.name}</p>
                                      <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Chưa tải chi tiết hoặc đơn không có sản phẩm.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
