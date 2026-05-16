import React, { useState } from 'react';

export default function UsersPage() {
  const [users] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@email.com', phone: '0901234567', role: 'user', joined: '2024-01-15' },
    { id: 2, name: 'Trần Thị B', email: 'tranb@email.com', phone: '0902345678', role: 'user', joined: '2024-02-20' },
    { id: 3, name: 'Lê Văn C', email: 'levan@email.com', phone: '0903456789', role: 'user', joined: '2024-03-10' },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản Lý Khách Hàng</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Điện Thoại</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vai Trò</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày Tham Gia</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
