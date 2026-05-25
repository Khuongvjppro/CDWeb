import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, ShoppingCart, Users, TrendingUp, DollarSign, Box } from "lucide-react";
import { authAPI, orderAPI, productAPI } from "../utils/api";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const formatCurrency = (value) => `${currencyFormatter.format(Number(value) || 0)}₫`;

const getOrderDate = (order) => order.createdAt || order.created_at || order.date || Date.now();

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
          productAPI.getAll(),
          orderAPI.getAll(),
          authAPI.getUsers(),
        ]);

        setProducts(productsResponse.data || []);
        setOrders(ordersResponse.data || []);
        setUsers(usersResponse.data || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.error || "Không thể tải dữ liệu quản trị từ database");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0),
    [orders],
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders],
  );

  const latestOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(getOrderDate(b)) - new Date(getOrderDate(a))).slice(0, 4),
    [orders],
  );

  const monthlyRevenue = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const monthIndex = new Date().getMonth() - (5 - index);
        const normalizedMonth = (monthIndex + 12) % 12;
        return orders
          .filter((order) => new Date(getOrderDate(order)).getMonth() === normalizedMonth)
          .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
      }),
    [orders],
  );

  const chartMax = Math.max(...monthlyRevenue, 1);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bảng Điều Khiển</h1>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard icon={ShoppingCart} label="Đơn Hàng" value={orders.length} color="bg-blue-600" />
            <StatCard icon={TrendingUp} label="Doanh Thu" value={formatCurrency(totalRevenue)} color="bg-green-600" />
            <StatCard icon={Box} label="Sản Phẩm" value={products.length} color="bg-purple-600" />
            <StatCard icon={Users} label="Khách Hàng" value={users.length} color="bg-orange-600" />
            <StatCard icon={ShoppingCart} label="Chờ Xử Lý" value={pendingOrders} color="bg-red-600" />
            <StatCard icon={DollarSign} label="Trung Bình/Đơn" value={orders.length ? formatCurrency(totalRevenue / orders.length) : "0₫"} color="bg-yellow-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <BarChart3 size={20} />
                <span>Doanh Thu 6 Tháng</span>
              </h2>
              <div className="h-64 flex items-end justify-around">
                {monthlyRevenue.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-amber-600 rounded-t-lg"
                      style={{
                        width: "30px",
                        height: `${(value / chartMax) * 200}px`,
                      }}
                    />
                    <p className="text-xs text-gray-600 mt-2">T{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn Hàng Gần Đây</h2>
              <div className="space-y-3">
                {latestOrders.length === 0 ? (
                  <p className="text-sm text-gray-600">Chưa có đơn hàng nào trong database.</p>
                ) : (
                  latestOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Đơn hàng #{order.id}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900">
                        {order.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
