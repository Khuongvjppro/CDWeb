import React, { useState, useEffect } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../utils/api";
import {
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Calendar,
  ShoppingBag,
  Clock,
  ArrowRight,
  RefreshCw,
  DollarSign
} from "lucide-react";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const paymentState = queryParams.get("payment");
  const paymentOrderId = queryParams.get("orderId");

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) return;
    try {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: true }));
      const response = await orderAPI.getById(orderId);
      setOrderDetails((prev) => ({ ...prev, [orderId]: response.data }));
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleExpandToggle = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      fetchOrderDetails(orderId);
    }
  };

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString("vi-VN")} VNĐ`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Chờ Xử Lý",
        icon: <Clock className="text-amber-600" size={18} />,
        bgClass: "bg-amber-50 text-amber-800 border-amber-200",
        badgeClass: "bg-amber-100 text-amber-900 border border-amber-200"
      },
      processing: {
        label: "Đang Xử Lý",
        icon: <Package className="text-blue-600" size={18} />,
        bgClass: "bg-blue-50 text-blue-800 border-blue-200",
        badgeClass: "bg-blue-100 text-blue-900 border border-blue-200"
      },
      shipped: {
        label: "Đang Giao Hàng",
        icon: <Truck className="text-purple-600" size={18} />,
        bgClass: "bg-purple-50 text-purple-800 border-purple-200",
        badgeClass: "bg-purple-100 text-purple-900 border border-purple-200"
      },
      delivered: {
        label: "Đã Giao Thành Công",
        icon: <CheckCircle className="text-emerald-600" size={18} />,
        bgClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-200"
      },
      cancelled: {
        label: "Đã Hủy",
        icon: <XCircle className="text-rose-600" size={18} />,
        bgClass: "bg-rose-50 text-rose-800 border-rose-200",
        badgeClass: "bg-rose-100 text-rose-900 border border-rose-200"
      }
    };
    return configs[status] || {
      label: status,
      icon: <Package className="text-stone-600" size={18} />,
      bgClass: "bg-stone-50 text-stone-800 border-stone-200",
      badgeClass: "bg-stone-100 text-stone-900 border border-stone-200"
    };
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-shell">
      <div className="page-content section-wrap max-w-4xl">
        {/* Banner Section */}
        <div className="hero-panel-soft mb-8 p-6 sm:p-8 rounded-[2rem] border border-white/60 bg-gradient-to-r from-amber-50/50 to-orange-50/20 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow bg-white/90 border-[#e7d8c9] text-[#b55239]">Lịch sử đơn hàng</span>
              <h1 className="title-xl mt-3 text-3xl sm:text-4xl font-extrabold text-[#5a3e36]">Đơn hàng của tôi</h1>
              <p className="text-sm text-[#7a665f] mt-1">Theo dõi quá trình vận chuyển và lịch sử mua sắm của bạn.</p>
            </div>
            <button
              onClick={fetchOrders}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm transition-all"
              title="Làm mới"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {paymentState && (
            <div
              className={`mt-6 flex items-center gap-3 rounded-2xl px-5 py-4 border text-sm font-semibold shadow-sm transition-all duration-300 ${
                paymentState === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {paymentState === "success" ? (
                <>
                  <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                  <span>
                    Thanh toán VNPay thành công
                    {paymentOrderId ? ` cho đơn hàng #${paymentOrderId}` : ""}. Đơn hàng đang được chuẩn bị!
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-rose-600 shrink-0" />
                  <span>Giao dịch VNPay chưa hoàn tất hoặc đã bị hủy bỏ. Vui lòng kiểm tra lại.</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="premium-panel flex flex-col items-center justify-center py-24 shadow-sm border border-stone-100 rounded-[2rem]">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-[#b55239]"></span>
            </div>
            <p className="text-stone-500 mt-4 font-medium">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="premium-panel flex flex-col items-center justify-center px-6 py-20 text-center shadow-sm border border-[#e7d8c9]/60 rounded-[2rem] bg-white/65">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner mb-4">📦</div>
            <h3 className="text-xl font-bold text-stone-900">Bạn chưa có đơn hàng nào</h3>
            <p className="mt-2 text-stone-500 max-w-sm">
              Hãy đặt mua món uống yêu thích để bắt đầu tích lũy lịch sử mua hàng của bạn nhé!
            </p>
            <Link to="/products" className="btn-primary mt-6 inline-flex items-center gap-2 px-6">
              <span>Khám phá thực đơn</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
                <div 
                  key={order.id} 
                  className={`overflow-hidden rounded-[2rem] border transition-all duration-300 shadow-sm ${
                    isExpanded 
                      ? "border-amber-200 bg-white/95 ring-4 ring-amber-100/50" 
                      : "border-stone-200 bg-white/80 hover:border-amber-300 hover:bg-white"
                  }`}
                >
                  {/* Order Accordion Header */}
                  <button
                    onClick={() => handleExpandToggle(order.id)}
                    className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 text-left transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${statusConfig.bgClass}`}>
                        {statusConfig.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-stone-900">Đơn hàng #{order.id}</p>
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusConfig.badgeClass}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                          <span>•</span>
                          <span>{order.paymentMethod === "vnpay" ? "Thanh toán VNPay" : "Thanh toán COD"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-stone-100">
                      <div className="text-left sm:text-right">
                        <p className="text-xs uppercase tracking-wider text-stone-400">Tổng tiền</p>
                        <p className="text-lg font-black text-[#7A1523] mt-0.5">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-stone-400 transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180 text-amber-600" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Order Accordion Content */}
                  {isExpanded && (
                    <div className="border-t border-stone-150 bg-gradient-to-b from-stone-50/50 to-white/30 p-6">
                      <div className="grid gap-5 md:grid-cols-2">
                        {/* Shipping details */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-inner-sm">
                          <div className="flex items-center gap-2 font-bold text-stone-900 border-b border-stone-100 pb-2 mb-3">
                            <MapPin size={16} className="text-[#b55239]" />
                            <span>Thông tin giao hàng</span>
                          </div>
                          <p className="text-sm font-semibold text-stone-800">Địa chỉ:</p>
                          <p className="text-sm leading-6 text-stone-600 mt-1">
                            {order.shippingAddress || "Chưa cung cấp địa chỉ"}
                          </p>
                        </div>

                        {/* Payment details */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-inner-sm">
                          <div className="flex items-center gap-2 font-bold text-stone-900 border-b border-stone-100 pb-2 mb-3">
                            <CreditCard size={16} className="text-[#b55239]" />
                            <span>Thông tin thanh toán</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Phương thức:</span>
                              <span className="font-semibold text-stone-800">
                                {order.paymentMethod === "vnpay" ? "VNPay (Thanh toán online)" : "Thanh toán khi nhận hàng (COD)"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Trạng thái:</span>
                              <span className={`font-semibold ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                                {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán/Chờ thanh toán"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-inner-sm">
                        <div className="flex items-center gap-2 font-bold text-stone-900 border-b border-stone-100 pb-2 mb-4">
                          <ShoppingBag size={16} className="text-[#b55239]" />
                          <span>Món đã đặt</span>
                        </div>

                        {loadingDetails[order.id] ? (
                          <div className="flex items-center justify-center py-6 text-stone-500 gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                            <span className="text-sm">Đang tải chi tiết đồ uống...</span>
                          </div>
                        ) : orderDetails[order.id]?.items ? (
                          <div className="divide-y divide-stone-100">
                            {orderDetails[order.id].items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-12 w-12 rounded-xl object-cover border border-stone-100 shadow-sm"
                                      onError={(e) => { e.target.src = "/images/coffee-placeholder.jpg"; }}
                                    />
                                  ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-100 text-lg">
                                      ☕
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                                    <p className="text-xs text-stone-500 mt-0.5">Số lượng: {item.quantity}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-stone-900 text-sm">{formatCurrency(item.price)}</p>
                                  <p className="text-xs text-stone-400 mt-0.5">Đơn giá</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-stone-500 text-center py-4">Không có thông tin chi tiết.</p>
                        )}
                      </div>

                      {/* Total Amount Summary */}
                      <div className="mt-5 rounded-2xl bg-[#5a3e36] p-5 text-white flex items-center justify-between shadow-md">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e7d8c9]/90 font-medium">Tổng hóa đơn</p>
                          <p className="text-sm text-[#e7d8c9]/70 mt-0.5">Đã bao gồm VAT và phí giao hàng</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-amber-300">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
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
  );
}
