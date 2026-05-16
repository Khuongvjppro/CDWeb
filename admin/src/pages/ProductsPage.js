import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Cà Phê Đen Đắng', category: 'Cà Phê Đen', price: 35000, stock: 50 },
    { id: 2, name: 'Cà Phê Sữa Tươi', category: 'Cà Phê Sữa', price: 45000, stock: 40 },
    { id: 3, name: 'Espresso Chuẩn Ý', category: 'Espresso', price: 55000, stock: 35 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock)
    };
    setProducts([...products, newProduct]);
    setFormData({ name: '', category: '', price: '', stock: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Thêm Sản Phẩm Mới</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Chọn Danh Mục</option>
              <option value="Cà Phê Đen">Cà Phê Đen</option>
              <option value="Cà Phê Sữa">Cà Phê Sữa</option>
              <option value="Espresso">Espresso</option>
            </select>
            <input
              type="number"
              placeholder="Giá"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Kho hàng"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="col-span-2 flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg transition"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-lg transition"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Danh Mục</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kho</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                  {product.price.toLocaleString('vi-VN')}₫
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
