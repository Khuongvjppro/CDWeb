import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI, orderAPI, productAPI } from "../utils/api";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const formatCurrency = (value) =>
  `${currencyFormatter.format(Number(value) || 0)}`;

const formatDate = (value) =>
  new Date(value || Date.now()).toLocaleDateString("vi-VN");

const getOrderDate = (order) =>
  order.createdAt || order.created_at || order.date || Date.now();

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ categoriesRevenue: [], topProducts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse, usersResponse, statsResponse] =
          await Promise.all([
            productAPI.getAll(),
            orderAPI.getAll(),
            authAPI.getUsers(),
            orderAPI.getDashboardStats(),
          ]);

        setProducts(productsResponse.data || []);
        setOrders(ordersResponse.data || []);
        setUsers(usersResponse.data || []);
        setStats(statsResponse.data || { categoriesRevenue: [], topProducts: [] });
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

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const latestOrders = [...orders]
    .sort((a, b) => new Date(getOrderDate(b)) - new Date(getOrderDate(a)))
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
      <div
        className="admin-stat-card cursor-pointer border-t-[4px]"
        style={{ borderTopColor: accent }}
      >
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
              <span className="section-kicker">Coffee Shop Admin</span>
              <h1 className="title-xl">The Coffee Shop</h1>
              <p className="muted-copy mt-2 max-w-2xl">
                Số liệu vận hành được lấy trực tiếp từ database
              </p>
            </div>
            <div className="flex flex-wrap gap-3"></div>
          </div>
        </div>

        {loading ? (
          <div className="admin-surface-strong flex items-center justify-center py-20">
            <div className="text-stone-600">
              Đang tải dữ liệu từ database...
            </div>
          </div>
        ) : error ? (
          <div className="admin-surface-strong border border-red-200 bg-red-50 px-6 py-5 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
              <StatCard
                label="Đơn cà phê"
                value={orders.length}
                accent="#6b3df5"
                to="/admin/orders"
                hint="Tổng số ly/đơn đang ghi nhận"
              />
              <StatCard
                label="Doanh thu quán"
                value={formatCurrency(totalRevenue)}
                accent="#11b44a"
                hint="Dòng tiền từ các món đồ uống"
              />
              <StatCard
                label="Thực đơn cà phê"
                value={products.length}
                accent="#4b4641"
                to="/admin/products"
                hint="Đồ uống, món mới và bán chạy"
              />
              <StatCard
                label="Khách hàng thân thiết"
                value={users.length}
                accent="#ef5a00"
                to="/admin/users"
                hint="Người dùng đã ghé quán"
              />
              <StatCard
                label="Đơn chờ pha chế"
                value={pendingOrders}
                accent="#e11212"
                to="/admin/orders"
                hint="Cần được barista xử lý"
              />
              <StatCard
                label="Giá trị mỗi hóa đơn"
                value={
                  orders.length
                    ? formatCurrency(totalRevenue / orders.length)
                    : "0"
                }
                accent="#d59a00"
                hint="Mức chi tiêu trung bình của một order"
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="admin-panel p-6">
                <h2 className="mb-4 text-lg font-bold text-stone-950">
                  Doanh thu cà phê 6 tháng gần nhất
                </h2>
                <div className="rounded-[1.5rem] border border-amber-100 bg-gradient-to-b from-amber-50/80 to-white p-4">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="h-64 w-full"
                  >
                    <defs>
                      <linearGradient
                        id="revenueLine"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#d59a00" />
                        <stop offset="100%" stopColor="#b55239" />
                      </linearGradient>
                      <linearGradient
                        id="revenueArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="rgba(213,154,0,0.35)" />
                        <stop offset="100%" stopColor="rgba(213,154,0,0.02)" />
                      </linearGradient>
                    </defs>

                    {[0.25, 0.5, 0.75, 1].map((ratio) => (
                      <line
                        key={ratio}
                        x1={chartPadding}
                        y1={
                          chartHeight -
                          chartPadding -
                          (chartHeight - chartPadding * 2) * ratio
                        }
                        x2={chartWidth - chartPadding}
                        y2={
                          chartHeight -
                          chartPadding -
                          (chartHeight - chartPadding * 2) * ratio
                        }
                        stroke="rgba(181,82,57,0.10)"
                        strokeDasharray="4 6"
                      />
                    ))}

                    <path d={chartAreaPath} fill="url(#revenueArea)" />
                    <path
                      d={chartLinePath}
                      fill="none"
                      stroke="url(#revenueLine)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chartPoints.map((point, index) => (
                      <g key={index}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5.5"
                          fill="#fff"
                          stroke="#b55239"
                          strokeWidth="4"
                        />
                        <text
                          x={point.x}
                          y={chartHeight - 2}
                          textAnchor="middle"
                          className="fill-stone-500 text-[12px] font-semibold"
                        >
                          T{index + 1}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="admin-panel p-6">
                <h2 className="mb-4 text-lg font-bold text-stone-950">
                  Đơn order gần đây
                </h2>
                <div className="space-y-3">
                  {latestOrders.length === 0 ? (
                    <p className="text-sm text-stone-500">
                      Chưa có đơn order nào trong database.
                    </p>
                  ) : (
                    latestOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 transition hover:bg-amber-50"
                      >
                        <div>
                          <p className="font-semibold text-stone-950">
                            Đơn hàng #{order.id}
                          </p>
                          <p className="text-sm text-stone-500">
                            {formatDate(getOrderDate(order))}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-950">
                            {formatCurrency(order.totalAmount)}
                          </p>
                          <p className="text-sm font-medium text-amber-800">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Analytics Section */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Category Revenue Breakdown */}
              <div className="admin-panel p-6">
                <h2 className="mb-4 text-lg font-bold text-stone-950">
                  Cơ cấu doanh thu theo Danh mục
                </h2>
                <div className="space-y-4">
                  {!stats.categoriesRevenue || stats.categoriesRevenue.length === 0 ? (
                    <p className="text-sm text-stone-500">Chưa có dữ liệu thống kê.</p>
                  ) : (
                    stats.categoriesRevenue.map((cat, idx) => {
                      const revenueVal = Number(cat.revenue) || 0;
                      const percentage = totalRevenue > 0 ? (revenueVal / totalRevenue) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-stone-700">{cat.categoryName}</span>
                            <span className="font-bold text-stone-900">
                              {formatCurrency(revenueVal)} VNĐ ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#b55239]" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="admin-panel p-6">
                <h2 className="mb-4 text-lg font-bold text-[#2c221e]">
                  Top 5 sản phẩm bán chạy nhất
                </h2>
                <div className="space-y-3.5">
                  {!stats.topProducts || stats.topProducts.length === 0 ? (
                    <p className="text-sm text-stone-500">Chưa có dữ liệu thống kê.</p>
                  ) : (
                    stats.topProducts.map((prod, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white/70 px-4 py-3.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-[#b55239] border border-amber-100">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{prod.name}</p>
                            <p className="text-xs text-stone-500 mt-0.5">Danh mục: {prod.category || "Cà phê"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-[#7A1523] text-sm">{formatCurrency(prod.totalRevenue)} VNĐ</p>
                          <p className="text-xs text-[#b55239] mt-0.5 font-bold">Đã bán: {prod.totalQty} ly</p>
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
