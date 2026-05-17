import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../utils/api";
import { ChevronDown, Package, Truck, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getUserOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package className="text-yellow-600" size={20} />;
      case "processing":
        return <Package className="text-blue-600" size={20} />;
      case "shipped":
        return <Truck className="text-purple-600" size={20} />;
      case "delivered":
        return <CheckCircle className="text-green-600" size={20} />;
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

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-shell">
      <div className="page-content section-wrap">
        <div className="hero-panel-soft p-6 sm:p-8">
          <span className="section-kicker">Orders</span>
          <h1 className="title-xl">Đơn hàng của tôi</h1>
        </div>

        {loading ? (
          <div className="premium-panel mt-8 flex items-center justify-center py-20">
            <p className="text-stone-600">Đang tải...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="premium-panel mt-8 flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="text-6xl">📦</div>
            <p className="mt-5 text-lg font-semibold text-stone-900">
              Bạn chưa có đơn hàng nào
            </p>
            <p className="mt-2 text-stone-500">
              Khi đặt hàng xong, lịch sử mua sẽ hiển thị ở đây.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="surface-card-soft overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">
                        Đơn hàng #{order.id}
                      </p>
                      <p className="text-sm text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-stone-950">
                      {order.totalAmount.toLocaleString("vi-VN")}₫
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`text-stone-400 transition ${expandedOrder === order.id ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-stone-200 bg-white/60 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <h3 className="font-bold text-stone-900">
                          Địa chỉ giao hàng
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-stone-600">
                          {order.shippingAddress}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <h3 className="font-bold text-stone-900">Trạng thái</h3>
                        <p className="mt-2 text-sm leading-7 text-stone-600">
                          {getStatusLabel(order.status)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-stone-950 p-4 text-white">
                      <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
                        Tổng tiền
                      </p>
                      <p className="mt-2 text-2xl font-black text-amber-300">
                        {order.totalAmount.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
