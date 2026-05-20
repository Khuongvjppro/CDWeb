import React, { useState, useEffect } from "react";
import {
  BarChart3,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Box,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 45,
    totalRevenue: 2450000,
    totalProducts: 12,
    totalUsers: 38,
    pendingOrders: 8,
    monthlyRevenue: [1200000, 1450000, 1350000, 1600000, 1800000, 2100000],
  });

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          icon={ShoppingCart}
          label="Đơn Hàng"
          value={stats.totalOrders}
          color="bg-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Doanh Thu"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M₫`}
          color="bg-green-600"
        />
        <StatCard
          icon={Box}
          label="Sản Phẩm"
          value={stats.totalProducts}
          color="bg-purple-600"
        />
        <StatCard
          icon={Users}
          label="Khách Hàng"
          value={stats.totalUsers}
          color="bg-orange-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Chờ Xử Lý"
          value={stats.pendingOrders}
          color="bg-red-600"
        />
        <StatCard
          icon={DollarSign}
          label="Trung Bình/Đơn"
          value={`${Math.round(stats.totalRevenue / stats.totalOrders / 1000)}K₫`}
          color="bg-yellow-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>Doanh Thu 6 Tháng</span>
          </h2>
          <div className="h-64 flex items-end justify-around">
            {stats.monthlyRevenue.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-amber-600 rounded-t-lg"
                  style={{
                    width: "30px",
                    height: `${(value / Math.max(...stats.monthlyRevenue)) * 200}px`,
                  }}
                />
                <p className="text-xs text-gray-600 mt-2">T{index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Đơn Hàng Gần Đây
          </h2>
          <div className="space-y-3">
            {[
              {
                id: 1,
                customer: "Nguyễn Văn A",
                amount: 450000,
                status: "Đã Giao",
              },
              {
                id: 2,
                customer: "Trần Thị B",
                amount: 350000,
                status: "Đang Gửi",
              },
              {
                id: 3,
                customer: "Lê Văn C",
                amount: 250000,
                status: "Đang Xử Lý",
              },
              {
                id: 4,
                customer: "Phạm Thị D",
                amount: 520000,
                status: "Chờ Xử Lý",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.customer}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.amount.toLocaleString("vi-VN")}₫
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
