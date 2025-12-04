/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../utils/format';
  
const Home = () => {
  

  const [stats, setStats] = useState(null);
  const [recentTrans, setRecentTrans] = useState([]);
  const [categories, setCategories] = useState([]); // State lưu danh mục cho modal
  const [showModal, setShowModal] = useState(false); // State điều khiển Modal
  

  
  const currentDate = new Date();
  
  // State cho Form thêm mới
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  // Hàm tải dữ liệu
  const fetchData = async () => {
    try {
      // 1. Lấy thống kê
      const warnRes = await api.getWarnings(currentDate.getMonth() + 1, currentDate.getFullYear());
      setStats(warnRes.data);

      // 2. Lấy giao dịch gần đây
      const transRes = await api.getTransactions();
      if (transRes.data && Array.isArray(transRes.data)) {
         setRecentTrans(transRes.data.slice(0, 5)); 
      }

      // 3. Lấy danh mục (để dùng trong Modal)
      const catRes = await api.getCategories();
      setCategories(catRes.data);

    } catch (error) {
      console.error("Lỗi tải trang chủ", error);
    }
  };

  useEffect(() => {
     
    fetchData();
  }, []);

  // Xử lý khi bấm Lưu trong Modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createTransaction({
        userId: 1, 
        categoryId: formData.categoryId,
        amount: Number(formData.amount),
        date: formData.date,
        note: formData.note
      });
      alert("Thêm giao dịch thành công!");
      setShowModal(false);
      
      // Reset form
      setFormData({ amount: '', categoryId: '', date: new Date().toISOString().split('T')[0], note: '' });
      
      // Tải lại dữ liệu trang chủ để cập nhật số tiền mới
      fetchData(); 
    } catch (err) {
      alert("Lỗi thêm giao dịch: " + (err.response?.data?.message || err.message));
    }
  };

  if (!stats) return <div className="p-6">Đang tải dữ liệu...</div>;

  const remaining = stats.total.totalBudget - stats.total.totalSpent;
  const percentUsed = stats.total.totalBudget > 0 
    ? Math.round((stats.total.totalSpent / stats.total.totalBudget) * 100) 
    : 0;

  return (
    <div>
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Trang chủ</h1>
      
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Thêm giao dịch
        </button>
      </div>

      {/* CARDS THỐNG KÊ  */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        {/* Card 1: Tổng chi */}
        <div className="p-6 text-white bg-blue-500 shadow-lg rounded-2xl shadow-blue-200">
          <p className="mb-1 text-sm text-blue-100">Tổng chi tháng này</p>
          <h2 className="text-3xl font-bold">{formatCurrency(stats.total.totalSpent)}</h2>
          <div className="inline-block px-3 py-1 mt-4 text-xs bg-blue-600 rounded-full">
            Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </div>
        </div>

        {/* Card 2: Ngân sách còn lại */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-gray-500">Ngân sách còn lại</p>
            <div className="p-2 text-blue-600 rounded-full bg-blue-50">🏛️</div>
          </div>
          <h2 className={`text-3xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
            {formatCurrency(remaining)}
          </h2>
          <div className="w-full h-2 mt-4 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${percentUsed > 100 ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-right text-gray-400">{percentUsed}% sử dụng</p>
        </div>

        {/* Card 3: Trạng thái danh mục */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h3 className="mb-4 text-sm text-gray-500">Trạng thái danh mục</h3>
          <div className="space-y-3 overflow-y-auto max-h-[120px]">
            {stats.byCategory.slice(0, 3).map((cat) => (
              <div key={cat.CategoryID}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium text-gray-700">{cat.CategoryName}</span>
                  <span className={cat.isOver ? 'text-red-500' : 'text-gray-500'}>
                    {cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${cat.isOver ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DANH SÁCH GẦN ĐÂY  */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Giao dịch gần đây</h3>
          <Link to="/transactions" className="text-sm font-medium text-blue-600 hover:underline">Xem tất cả →</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs tracking-wider text-left text-gray-400 uppercase border-b border-gray-100">
              <th className="pb-3 font-medium">Nội dung</th>
              <th className="pb-3 font-medium">Danh mục</th>
              <th className="pb-3 font-medium text-right">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentTrans.map((t) => (
              <tr key={t.TransactionID} className="transition-colors group hover:bg-gray-50">
                <td className="py-4 font-medium text-gray-700">{t.Note}</td>
                <td className="py-4">
                  <span className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded-full">
                    {t.CategoryName}
                  </span>
                </td>
                <td className="py-4 font-bold text-right text-gray-800">
                  {formatCurrency(t.Amount)}
                </td>
              </tr>
            ))}
            {recentTrans.length === 0 && (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-400">Chưa có giao dịch nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  MODAL (POPUP)  */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md overflow-hidden duration-200 bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 text-white bg-blue-600">
              <h3 className="text-lg font-bold">Thêm khoản chi mới</h3>
              <button onClick={() => setShowModal(false)} className="text-2xl leading-none text-white/80 hover:text-white">&times;</button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Số tiền (VND)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-3 text-lg font-bold text-blue-600 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0 đ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Ngày chi</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Danh mục</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => (
                      <option key={c.CategoryID} value={c.CategoryID}>{c.Name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Ghi chú</label>
                <textarea 
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Mua quà sinh nhật..."
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                >
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;