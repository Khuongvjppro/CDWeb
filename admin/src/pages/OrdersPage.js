import React, { useState } from "react";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Nguyễn Văn A",
      amount: 450000,
      status: "delivered",
      date: "2024-05-15",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      amount: 350000,
      status: "shipped",
      date: "2024-05-14",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      amount: 250000,
      status: "processing",
      date: "2024-05-13",
    },
    {
      id: 4,
      customer: "Phạm Thị D",
      amount: 520000,
      status: "pending",
      date: "2024-05-12",
    },
  ]);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-900",
      processing: "bg-blue-100 text-blue-900",
      shipped: "bg-purple-100 text-purple-900",
      delivered: "bg-green-100 text-green-900",
    };
    return colors[status] || "bg-gray-100 text-gray-900";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ Xử Lý",
      processing: "Đang Xử Lý",
      shipped: "Đã Gửi",
      delivered: "Đã Giao",
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Quản Lý Đơn Hàng
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Mã Đơn
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Khách Hàng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Số Tiền
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                  {order.amount.toLocaleString("vi-VN")}₫
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">Chờ Xử Lý</option>
                    <option value="processing">Đang Xử Lý</option>
                    <option value="shipped">Đã Gửi</option>
                    <option value="delivered">Đã Giao</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
