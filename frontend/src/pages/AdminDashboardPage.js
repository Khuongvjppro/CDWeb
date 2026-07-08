import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI, orderAPI, productAPI, reviewAPI } from "../utils/api";

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
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ categoriesRevenue: [], topProducts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse, usersResponse, statsResponse, reviewsResponse] =
          await Promise.all([
            productAPI.getAll(),
            orderAPI.getAll(),
            authAPI.getUsers(),
            orderAPI.getDashboardStats(),
            reviewAPI.getAllAdmin(),
          ]);

        setProducts(productsResponse.data || []);
        setOrders(ordersResponse.data || []);
        setUsers(usersResponse.data || []);
        setStats(statsResponse.data || { categoriesRevenue: [], topProducts: [] });
        setReviews(reviewsResponse.data || []);
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

  const last6MonthsData = Array.from({ length: 6 }, (_, index) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - index));
    const targetMonth = d.getMonth();
    const targetYear = d.getFullYear();

    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(getOrderDate(order));
      return orderDate.getMonth() === targetMonth && orderDate.getFullYear() === targetYear;
    });

    const revenue = monthOrders.reduce(
      (sum, order) => sum + (Number(order.totalAmount) || 0),
      0,
    );

    return {
      monthLabel: `Tháng ${targetMonth + 1}/${targetYear}`,
      shortLabel: `T${targetMonth + 1}`,
      revenue,
      orderCount: monthOrders.length,
    };
  });

  const formatShortCurrency = (val) => {
    if (val === 0) return "0đ";
    if (val >= 1000000) {
      const formatted = (val / 1000000).toFixed(1);
      return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted} tr`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}k`;
    }
    return `${val}đ`;
  };

  const chartMax = Math.max(...last6MonthsData.map(d => d.revenue), 100000);
  const chartWidth = 560;
  const chartHeight = 260;
  const chartLeftPadding = 65;
  const chartRightPadding = 25;
  const chartTopPadding = 35;
  const chartBottomPadding = 35;

  const usableWidth = chartWidth - chartLeftPadding - chartRightPadding;
  const usableHeight = chartHeight - chartTopPadding - chartBottomPadding;

  const chartStep = usableWidth / (last6MonthsData.length - 1 || 1);
  const chartPoints = last6MonthsData.map((data, index) => {
    const x = chartLeftPadding + index * chartStep;
    const y =
      chartHeight -
      chartBottomPadding -
      (data.revenue / chartMax) * usableHeight;
    return { x, y, ...data };
  });

  const chartLinePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const chartAreaPath = chartPoints.length > 0 
    ? `${chartLinePath} L ${chartPoints[chartPoints.length - 1].x},${chartHeight - chartBottomPadding} L ${chartPoints[0].x},${chartHeight - chartBottomPadding} Z`
    : "";

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
        
        {/* Welcome Status Banner */}
        <div className="mb-8 pt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#11b44a] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#b55239] font-sans">
                Trạng thái vận hành quán
              </span>
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mt-1.5">
              Tổng quan hôm nay
            </h1>
            <p className="text-sm text-stone-500">
              Số liệu thống kê tự động cập nhật thời gian thực từ cơ sở dữ liệu.
            </p>
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
                label="Đánh giá từ khách"
                value={reviews.length}
                accent="#d59a00"
                to="/admin/reviews"
                hint="Ý kiến phản hồi từ người mua"
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
                    className="h-64 w-full overflow-visible"
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

                    {/* Y-Axis Grid Lines */}
                    {[0.25, 0.5, 0.75, 1].map((ratio) => (
                      <line
                        key={ratio}
                        x1={chartLeftPadding}
                        y1={chartHeight - chartBottomPadding - usableHeight * ratio}
                        x2={chartWidth - chartRightPadding}
                        y2={chartHeight - chartBottomPadding - usableHeight * ratio}
                        stroke="rgba(181,82,57,0.10)"
                        strokeDasharray="4 6"
                      />
                    ))}

                    {/* Y-Axis Labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                      const val = ratio * chartMax;
                      const y = chartHeight - chartBottomPadding - usableHeight * ratio;
                      return (
                        <text
                          key={`y-label-${ratio}`}
                          x={chartLeftPadding - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-stone-400 text-[10px] font-semibold"
                        >
                          {formatShortCurrency(val)}
                        </text>
                      );
                    })}

                    {/* Axis Lines */}
                    <line
                      x1={chartLeftPadding}
                      y1={chartHeight - chartBottomPadding}
                      x2={chartWidth - chartRightPadding}
                      y2={chartHeight - chartBottomPadding}
                      stroke="rgba(181,82,57,0.15)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={chartLeftPadding}
                      y1={chartTopPadding}
                      x2={chartLeftPadding}
                      y2={chartHeight - chartBottomPadding}
                      stroke="rgba(181,82,57,0.15)"
                      strokeWidth="1.5"
                    />

                    {/* Area under curve */}
                    <path d={chartAreaPath} fill="url(#revenueArea)" />

                    {/* Line curve */}
                    <path
                      d={chartLinePath}
                      fill="none"
                      stroke="url(#revenueLine)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Points & Labels */}
                    {chartPoints.map((point, index) => (
                      <g key={index}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={hoveredPoint === index ? 7.5 : 5.5}
                          fill="#fff"
                          stroke={hoveredPoint === index ? "#b55239" : "#d59a00"}
                          strokeWidth={hoveredPoint === index ? 5 : 4}
                          className="transition-all duration-150 ease-out"
                        />
                        {/* Short Value Text Label above point */}
                        {hoveredPoint !== index && (
                          <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            className="fill-stone-600 text-[10px] font-bold"
                          >
                            {formatShortCurrency(point.revenue)}
                          </text>
                        )}
                        {/* X-Axis Month Label */}
                        <text
                          x={point.x}
                          y={chartHeight - 12}
                          textAnchor="middle"
                          className="fill-stone-500 text-[11px] font-bold"
                        >
                          {point.shortLabel}
                        </text>
                      </g>
                    ))}

                    {/* Invisible hover zones for easy interactivity */}
                    {chartPoints.map((point, index) => {
                      const rectWidth = chartStep;
                      const rectX = point.x - rectWidth / 2;
                      return (
                        <rect
                          key={`hover-${index}`}
                          x={rectX}
                          y={chartTopPadding}
                          width={rectWidth}
                          height={usableHeight}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPoint(index)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}

                    {/* Interactive Tooltip */}
                    {hoveredPoint !== null && (() => {
                      const point = chartPoints[hoveredPoint];
                      const showTooltipBelow = point.y - 65 < 5;
                      const tooltipY = showTooltipBelow ? point.y + 15 : point.y - 65;
                      const trianglePoints = showTooltipBelow
                        ? `${point.x - 6},${point.y + 15} ${point.x + 6},${point.y + 15} ${point.x},${point.y + 8}`
                        : `${point.x - 6},${point.y - 15} ${point.x + 6},${point.y - 15} ${point.x},${point.y - 8}`;
                      return (
                        <g className="pointer-events-none transition-all duration-150">
                          {/* Tooltip Card */}
                          <rect
                            x={point.x - 75}
                            y={tooltipY}
                            width="150"
                            height="50"
                            rx="8"
                            fill="#2c221e"
                            stroke="#b55239"
                            strokeWidth="1.5"
                            className="shadow-lg"
                          />
                          {/* Triangle pointer */}
                          <polygon
                            points={trianglePoints}
                            fill="#2c221e"
                            stroke="#b55239"
                            strokeWidth="1.5"
                          />
                          <polygon
                            points={trianglePoints}
                            fill="#2c221e"
                          />
                          {/* Tooltip Contents */}
                          <text
                            x={point.x}
                            y={tooltipY + 18}
                            textAnchor="middle"
                            fill="#f3b498"
                            fontSize="10px"
                            fontWeight="bold"
                          >
                            {point.monthLabel}
                          </text>
                          <text
                            x={point.x}
                            y={tooltipY + 36}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="11px"
                            fontWeight="extrabold"
                          >
                            {formatCurrency(point.revenue)}đ ({point.orderCount} đơn)
                          </text>
                        </g>
                      );
                    })()}
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
