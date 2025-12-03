import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

const Budgets = () => {
  const [categories, setCategories] = useState([]); 
  const [reportData, setReportData] = useState({ byCategory: [] });
  
  // State cho việc sửa ngân sách (Inline Edit)
  const [editingId, setEditingId] = useState(null); 
  const [editAmount, setEditAmount] = useState(''); 

  const date = new Date();

  // Load dữ liệu
  const loadData = async () => {
    try {
      const catRes = await api.getCategories();
      const warnRes = await api.getWarnings(date.getMonth() + 1, date.getFullYear());
      
      setCategories(catRes.data);
      setReportData(warnRes.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const combinedData = categories.map(cat => {
    const reportItem = reportData.byCategory.find(r => r.CategoryID === cat.CategoryID) || {};
    return {
      ...cat,
      spent: Number(reportItem.spent) || 0,
      budget: Number(reportItem.budget) || 0,
      isOver: reportItem.isOver || false
    };
  });

  const totalBudget = combinedData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = combinedData.reduce((sum, item) => sum + item.spent, 0);
  const totalPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const isTotalOver = totalBudget > 0 && totalSpent > totalBudget;

  // --- CÁC HÀM XỬ LÝ (ACTIONS) ---

  // Bắt đầu sửa
  const startEdit = (cat) => {
    setEditingId(cat.CategoryID);
    setEditAmount(cat.budget);
  };

  // Hủy sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };

  // Lưu sửa đổi
  const saveEdit = async (categoryId) => {
    try {
      await api.upsertBudget({
        categoryId,
        amount: Number(editAmount),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
      setEditingId(null);
      loadData(); // Tải lại dữ liệu để cập nhật giao diện
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  // Thêm danh mục mới
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if(!newCatName) return;
    try {
      const catRes = await api.createCategory({ name: newCatName, type: 'expense', icon: '🏷️' });
      
      // Nếu có nhập ngân sách thì lưu luôn
      if (newCatBudget) {
        await api.upsertBudget({
          categoryId: catRes.data.CategoryID,
          amount: Number(newCatBudget),
          month: date.getMonth() + 1,
          year: date.getFullYear()
        });
      }
      setNewCatName('');
      setNewCatBudget('');
      loadData();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (id) => {
    if(confirm("Cảnh báo: Xóa danh mục sẽ xóa toàn bộ lịch sử giao dịch của nó. Bạn có chắc không?")) {
        try {
            await api.deleteCategory(id);
            loadData();
        } catch(err) {
            alert("Lỗi xóa: " + err.message);
        }
    }
  }

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Quản lý Ngân sách</h1>

      {/* --- CARD TỔNG QUAN (TỰ ĐỘNG TÍNH) --- */}
      <div className="p-6 mb-8 bg-white border border-blue-100 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-blue-900">💰 Tổng Ngân Sách Tháng {date.getMonth() + 1}</h3>
            <p className="text-sm text-gray-500">Tự động tổng hợp từ ngân sách các danh mục chi tiết.</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-blue-600">{formatMoney(totalBudget)}</div>
             <div className="text-xs text-gray-400">Tổng hạn mức</div>
          </div>
        </div>
        
        {/* Progress Bar Tổng */}
        <div>
           <div className="flex justify-between mb-1 text-xs font-semibold text-gray-500">
             <span>Đã chi: {formatMoney(totalSpent)}</span>
             <span className={isTotalOver ? 'text-red-500' : 'text-green-500'}>
                {isTotalOver ? 'Vượt hạn mức' : 'An toàn'} ({Math.round(totalPercent)}%)
             </span>
           </div>
           <div className="w-full h-4 overflow-hidden bg-gray-100 rounded-full">
             <div 
               className={`h-full transition-all duration-500 ${isTotalOver ? 'bg-red-500' : 'bg-green-500'}`}
               style={{ width: `${totalPercent}%` }}
             ></div>
           </div>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-bold text-gray-800">Chi tiết từng Danh mục</h3>

      {/* --- GRID DANH MỤC --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {combinedData.map((cat) => {
            const isEditing = editingId === cat.CategoryID;
            const percent = cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;

            return (
              <div key={cat.CategoryID} className="relative p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md group">
                
                {/* Header Card */}
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="p-3 font-bold text-orange-500 bg-orange-50 rounded-xl">
                        {cat.Icon || '🏷️'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{cat.Name}</h4>
                        <p className="text-xs text-gray-400">Đã chi: {formatMoney(cat.spent)}</p>
                      </div>
                   </div>
                   
                   {/* Các nút hành động: Sửa / Xóa */}
                   <div className="flex gap-1 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(cat.CategoryID)} className="p-2 text-green-600 rounded hover:bg-green-50" title="Lưu"><Save size={16}/></button>
                          <button onClick={cancelEdit} className="p-2 text-red-400 rounded hover:bg-red-50" title="Hủy"><X size={16}/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(cat)} className="p-2 text-blue-400 rounded hover:bg-blue-50" title="Sửa ngân sách"><Edit3 size={16}/></button>
                          <button onClick={() => handleDeleteCategory(cat.CategoryID)} className="p-2 text-gray-300 rounded hover:text-red-500 hover:bg-red-50" title="Xóa danh mục"><Trash2 size={16}/></button>
                        </>
                      )}
                   </div>
                </div>
                
                {/* Body Card (Ngân sách & Progress) */}
                <div className="mb-2">
                   <div className="flex items-end justify-between mb-1">
                      <span className="text-xs text-gray-500">Định mức:</span>
                      {isEditing ? (
                        <div className="flex items-center overflow-hidden border border-blue-400 rounded">
                           <input 
                              type="number" 
                              autoFocus
                              className="w-24 px-2 py-0.5 text-right font-bold text-sm outline-none text-blue-700"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                           />
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800">{formatMoney(cat.budget)}</span>
                      )}
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-2 rounded-full transition-all ${cat.isOver ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                   </div>
                </div>
              </div>
            );
        })}

        {/* --- FORM THÊM MỚI --- */}
        <div className="flex flex-col items-center justify-center p-6 text-center transition-colors bg-white border-2 border-gray-200 border-dashed rounded-2xl hover:border-blue-400">
            <div className="p-3 mb-3 text-blue-500 rounded-full bg-blue-50">
              <Plus size={24} />
            </div>
            <h4 className="mb-4 font-bold text-gray-700">Thêm danh mục mới</h4>
            <form onSubmit={handleCreateCategory} className="w-full space-y-3">
               <input 
                  type="text" placeholder="Tên danh mục (VD: Du lịch)" required
                  className="w-full px-4 py-2 text-sm border-none rounded-lg outline-none bg-gray-50 focus:ring-1 focus:ring-blue-300"
                  value={newCatName} onChange={e => setNewCatName(e.target.value)}
               />
               <input 
                  type="number" placeholder="Ngân sách dự kiến (VNĐ)"
                  className="w-full px-4 py-2 text-sm border-none rounded-lg outline-none bg-gray-50 focus:ring-1 focus:ring-blue-300"
                  value={newCatBudget} onChange={e => setNewCatBudget(e.target.value)}
               />
               <button type="submit" className="w-full py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">Thêm ngay</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Budgets;