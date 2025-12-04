/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#FF6B6B', '#4ECDC4'];

const Reports = () => {
  const [categories, setCategories] = useState([]);
  const [reportData, setReportData] = useState(null);
  const date = new Date();

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Lấy danh sách danh mục
        const catRes = await api.getCategories();
        // 2. Lấy dữ liệu cảnh báo/chi tiêu
        const warnRes = await api.getWarnings(date.getMonth() + 1, date.getFullYear());
        
        setCategories(catRes.data);
        setReportData(warnRes.data);
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
      }
    };
    load();
  }, []);

  if (!reportData) return <div className="p-6 text-center">Đang phân tích dữ liệu...</div>;

  // LOGIC TÍNH TOÁN (ĐỒNG BỘ VỚI TRANG NGÂN SÁCH) 
  
  const combinedData = categories.map(cat => {
    // Tìm data tương ứng trong API warnings
    const item = reportData.byCategory.find(r => r.CategoryID === cat.CategoryID) || {};
    return {
      name: cat.Name,
      spent: Number(item.spent) || 0,
      budget: Number(item.budget) || 0,
      isOver: item.isOver || false
    };
  });

  // 2. Tính lại các chỉ số tổng 
  const totalBudget = combinedData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = combinedData.reduce((sum, item) => sum + item.spent, 0);
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  
  // 3. Tìm danh mục chi nhiều nhất
  const topSpender = [...combinedData].sort((a, b) => b.spent - a.spent)[0];
  const countOverBudget = combinedData.filter(c => c.isOver).length;

  // CHUẨN BỊ DATA CHO BIỂU ĐỒ 

  // Biểu đồ tròn (Chỉ hiện cái nào có chi tiêu > 0)
  const pieData = combinedData
    .filter(c => c.spent > 0)
    .map(c => ({ name: c.name, value: c.spent }));

  // Biểu đồ cột (Hiện tất cả để so sánh, trừ cái nào 0/0 thì ẩn cho gọn)
  const barData = combinedData
    .filter(c => c.spent > 0 || c.budget > 0)
    .map(c => ({
      name: c.name,
      "Đã chi": c.spent,
      "Định mức": c.budget
    }));

  // Helper format tiền
  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Báo cáo & Phân tích</h1>
      
      {/* Nếu chưa có dữ liệu gì cả */}
      {pieData.length === 0 && barData.length === 0 ? (
        <div className="p-10 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="mb-4 text-6xl opacity-50">📊</div>
            <h3 className="text-xl font-bold text-gray-700">Chưa có dữ liệu tháng này</h3>
            <p className="mt-2 text-gray-500">Hãy thêm giao dịch hoặc thiết lập ngân sách để xem biểu đồ.</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                {/* BIỂU ĐỒ TRÒN */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h3 className="pb-2 mb-4 font-bold text-gray-700 border-b">Phân bố chi tiêu (Thực tế)</h3>
                <div className="h-[300px] flex items-center justify-center">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatMoney(value)} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="italic text-gray-400">Chưa có khoản chi nào</div>
                    )}
                </div>
                </div>

                {/* BIỂU ĐỒ CỘT */}
                <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h3 className="pb-2 mb-4 font-bold text-gray-700 border-b">So sánh: Thực tế vs Định mức</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : val} />
                        <Tooltip formatter={(value) => formatMoney(value)} />
                        <Legend verticalAlign="top"/>
                        <Bar dataKey="Đã chi" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Thực tế" />
                        <Bar dataKey="Định mức" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={20} name="Ngân sách" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>

            {/* TÓM TẮT CHỈ SỐ */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h3 className="mb-4 text-lg font-bold text-gray-700">Tóm tắt tình hình tài chính</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                        <span>🏆 Danh mục chi nhiều nhất:</span> 
                        <span className="px-2 py-1 font-bold text-gray-900 bg-gray-100 rounded">
                            {topSpender?.name || '---'} ({formatMoney(topSpender?.spent || 0)})
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>⚠️ Số danh mục vượt định mức:</span> 
                        <span className={`font-bold px-2 py-1 rounded ${countOverBudget > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {countOverBudget} danh mục
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>📊 Tỷ lệ sử dụng ngân sách tổng:</span> 
                        <span className="px-2 py-1 font-bold text-blue-600 rounded bg-blue-50">
                            {percentUsed}%
                        </span>
                        <span className="text-xs text-gray-400">
                            ({formatMoney(totalSpent)} / {formatMoney(totalBudget)})
                        </span>
                    </li>
                </ul>
            </div>
        </>
      )}
    </div>
  );
};

export default Reports;