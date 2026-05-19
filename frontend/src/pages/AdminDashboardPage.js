import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI, orderAPI, productAPI } from "../utils/api";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const formatCurrency = (value) => `${currencyFormatter.format(Number(value) || 0)}₫`;

const formatDate = (value) =>
  new Date(value || Date.now()).toLocaleDateString("vi-VN");

const getOrderDate = (order) =>
  order.createdAt || order.created_at || order.date || Date.now();

export default function AdminDashboardPage() {
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
        setError(
          fetchError.response?.data?.error ||
            "Không thể tải dữ liệu quản trị từ database",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.totalAmount) || 0),
    0,
  );

  const pendingOrders = orders.filter((order) => order.status === "pending")
    .length;

  const latestOrders = [...orders]
    .sort(
      (a, b) => new Date(getOrderDate(b)) - new Date(getOrderDate(a)),
    )
    .slice(0, 4);

  const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
    const monthIndex = new Date().getMonth() - (5 - index);
    const normalizedMonth = (monthIndex + 12) % 12;
    const monthOrders = orders.filter((order) => {
      const date = new Date(getOrderDate(order));
      return date.getMonth() === normalizedMonth;
    });

    return monthOrders.reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0,
    );
  });

  const chartMax = Math.max(...monthlyRevenue, 1);
  const chartWidth = 540;
  const chartHeight = 220;
  const chartPadding = 18;
  const chartStep = chartWidth / (monthlyRevenue.length - 1 || 1);
  const chartPoints = monthlyRevenue.map((value, index) => {
    const x = chartPadding + index * chartStep;
    const y =
      chartHeight -
      chartPadding -
      (value / chartMax) * (chartHeight - chartPadding * 2);
    return { x, y };
  });

  const chartLinePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const chartAreaPath = `${chartLinePath} L ${chartPoints[chartPoints.length - 1]?.x || chartWidth},${chartHeight - chartPadding} L ${chartPoints[0]?.x || chartPadding},${chartHeight - chartPadding} Z`;

  const StatCard = ({ label, value, to, accent = "#b55239", hint }) => {
    const content = (
      <div className="admin-stat-card cursor-pointer border-t-[4px]" style={{ borderTopColor: accent }}>
        <div>
          <p className="admin-stat-label">{label}</p>
          <p className="admin-stat-value">{value}</p>
          {hint ? <p className="mt-3 text-sm text-stone-500">{hint}</p> : null}
        </div>
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <div className="page-shell admin-shell">
      <div className="page-content section-wrap py-10">
        <div className="admin-panel-soft mb-8 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="section-kicker">Admin</span>
              <h1 className="title-xl">admin</h1>
              <p className="muted-copy mt-2 max-w-2xl">
                Toàn bộ số liệu dưới đây được lấy trực tiếp từ dữ liệu trong database qua API backend.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="admin-chip-soft">Dữ liệu thật từ DB</span>
              <span className="admin-chip-soft">Cập nhật theo thời gian thực</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-surface-strong flex items-center justify-center py-20">
            <div className="text-stone-600">Đang tải dữ liệu từ database...</div>
          </div>
        ) : error ? (
          <div className="admin-surface-strong border border-red-200 bg-red-50 px-6 py-5 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
              <StatCard label="Đơn Hàng" value={orders.length} accent="#6b3df5" hint="Tổng số đơn trong hệ thống" />
              <StatCard label="Doanh Thu" value={formatCurrency(totalRevenue)} accent="#11b44a" hint="Tổng doanh thu đã ghi nhận" />
              <StatCard label="Quản Lý Sản Phẩm" value={products.length} accent="#4b4641" to="/admin/products" hint="Đi tới danh sách sản phẩm" />
              <StatCard label="Khách Hàng" value={users.length} accent="#ef5a00" hint="Tài khoản đã có trong DB" />
              <StatCard label="Xử Lý Đơn Hàng" value={pendingOrders} accent="#e11212" to="/admin/orders" hint="Đơn đang chờ xử lý" />
              <StatCard label="Trung Bình/Đơn" value={orders.length ? formatCurrency(totalRevenue / orders.length) : "0₫"} accent="#d59a00" hint="Giá trị trung bình mỗi đơn" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="admin-panel p-6">
                <h2 className="mb-4 text-lg font-bold text-stone-950">Doanh thu 6 tháng gần nhất</h2>
                <div className="rounded-[1.5rem] border border-amber-100 bg-gradient-to-b from-amber-50/80 to-white p-4">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-64 w-full">
                    <defs>
                      <linearGradient id="revenueLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d59a00" />
                        <stop offset="100%" stopColor="#b55239" />
                      </linearGradient>
                      <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(213,154,0,0.35)" />
                        <stop offset="100%" stopColor="rgba(213,154,0,0.02)" />
                      </linearGradient>
                    </defs>

                    {[0.25, 0.5, 0.75, 1].map((ratio) => (
                      <line
                        key={ratio}
                        x1={chartPadding}
                        y1={chartHeight - chartPadding - (chartHeight - chartPadding * 2) * ratio}
                        x2={chartWidth - chartPadding}
                        y2={chartHeight - chartPadding - (chartHeight - chartPadding * 2) * ratio}
                        stroke="rgba(181,82,57,0.10)"
                        strokeDasharray="4 6"
                      />
                    ))}

                    <path d={chartAreaPath} fill="url(#revenueArea)" />
                    <path d={chartLinePath} fill="none" stroke="url(#revenueLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {chartPoints.map((point, index) => (
                      <g key={index}>
                        <circle cx={point.x} cy={point.y} r="5.5" fill="#fff" stroke="#b55239" strokeWidth="4" />
                        <text x={point.x} y={chartHeight - 2} textAnchor="middle" className="fill-stone-500 text-[12px] font-semibold">
                          T{index + 1}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="admin-panel p-6">
                <h2 className="mb-4 text-lg font-bold text-stone-950">Đơn hàng gần đây</h2>
                <div className="space-y-3">
                  {latestOrders.length === 0 ? (
                    <p className="text-sm text-stone-500">Chưa có đơn hàng nào trong database.</p>
                  ) : (
                    latestOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 transition hover:bg-amber-50"
                      >
                        <div>
                          <p className="font-semibold text-stone-950">Đơn hàng #{order.id}</p>
                          <p className="text-sm text-stone-500">{formatDate(getOrderDate(order))}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-950">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-sm font-medium text-amber-800">{order.status}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
