import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Plus, Trash2, Search, Edit } from 'lucide-react'; 
import { format } from 'date-fns';

const Transactions = () => {
  const [originalList, setOriginalList] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter state
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTime, setFilterTime] = useState('current_month');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal & Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  
  const [formData, setFormData] = useState({
    amount: '', categoryId: '', date: new Date().toISOString().split('T')[0], note: ''
  });

  const fetchData = async () => {
    try {
      const transRes = await api.getTransactions();
      const catRes = await api.getCategories();
      setOriginalList(transRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    const fetchAsync = async () => {
      await fetchData();
    };
    fetchAsync();
  }, []);

  // Logic lọc dữ liệu
  useEffect(() => {
    let result = [...originalList];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (searchTerm) {
      result = result.filter(item => item.Note.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterTime !== 'all') {
      result = result.filter(item => {
        const itemDate = new Date(item.TransactionDate);
        if (filterTime === 'current_month') return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        if (filterTime === 'last_month') {
           const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
           const yearOfLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;
           return itemDate.getMonth() === lastMonth && itemDate.getFullYear() === yearOfLastMonth;
        }
        return true;
      });
    }

    if (filterCategory !== 'all') {
      result = result.filter(item => String(item.CategoryID) === String(filterCategory));
    }

    setFilteredList(result);
  }, [originalList, searchTerm, filterTime, filterCategory]);

  // --- HÀM XỬ LÝ SỬA (EDIT) ---
  const handleEdit = (item) => {
    setEditingId(item.TransactionID); // Lưu ID đang sửa
    setFormData({
        amount: item.Amount,
        categoryId: item.CategoryID,
        // Chuyển ngày về định dạng YYYY-MM-DD cho input date
        date: new Date(item.TransactionDate).toISOString().split('T')[0],
        note: item.Note
    });
    setShowModal(true); // Mở Modal
  };

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
      await api.deleteTransaction(id);
      fetchData();
    }
  };

  // --- HÀM SUBMIT (TẠO HOẶC CẬP NHẬT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: 1,
        categoryId: formData.categoryId,
        amount: Number(formData.amount),
        date: formData.date,
        note: formData.note
      };

      if (editingId) {
        await api.updateTransaction(editingId, payload);
        alert("Cập nhật thành công!");
      } else {
        await api.createTransaction(payload);
        alert("Thêm mới thành công!");
      }

      closeModal();
      fetchData();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const closeModal = () => {
      setShowModal(false);
      setEditingId(null); // Reset trạng thái sửa
      setFormData({ amount: '', categoryId: '', date: new Date().toISOString().split('T')[0], note: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nhật ký chi tiêu</h1>
        <button 
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Thêm giao dịch
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 p-4 mb-6 bg-white shadow-sm rounded-xl md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Tìm kiếm khoản chi..." 
            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg outline-none bg-gray-50" value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
          <option value="current_month">Tháng này</option>
          <option value="last_month">Tháng trước</option>
          <option value="all">Tất cả thời gian</option>
        </select>
        <select className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg outline-none bg-gray-50" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Tất cả danh mục</option>
          {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.Name}</option>)}
        </select>
      </div>

      {/* Danh sách giao dịch */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-left text-gray-500 uppercase">Thời gian</th>
              <th className="px-6 py-4 text-xs font-bold text-left text-gray-500 uppercase">Chi tiết khoản chi</th>
              <th className="px-6 py-4 text-xs font-bold text-left text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-4 text-xs font-bold text-right text-gray-500 uppercase">Số tiền</th>
              <th className="px-6 py-4 text-xs font-bold text-center text-gray-500 uppercase">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item.TransactionID} className="transition-colors hover:bg-blue-50/50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(item.TransactionDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.Note}</td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">
                      {categories.find(c => c.CategoryID === item.CategoryID)?.Icon || '🏷️'} 
                      {item.CategoryName}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-right text-gray-800">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                        {/* NÚT SỬA */}
                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 transition-all rounded-full hover:bg-blue-50" title="Sửa">
                            <Edit size={18} />
                        </button>
                        {/* NÚT XÓA */}
                        <button onClick={() => handleDelete(item.TransactionID)} className="p-2 text-red-400 transition-all rounded-full hover:text-red-500 hover:bg-red-50" title="Xóa">
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-10 italic text-center text-gray-400">Không tìm thấy giao dịch nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form (Dùng chung cho Thêm và Sửa) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md overflow-hidden duration-200 bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in">
            <div className="flex items-center justify-between px-6 py-4 text-white bg-blue-600">
              {/* Đổi tiêu đề dựa trên trạng thái */}
              <h3 className="text-lg font-bold">{editingId ? 'Chỉnh sửa giao dịch' : 'Thêm khoản chi mới'}</h3>
              <button onClick={closeModal} className="text-2xl leading-none text-white/80 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Số tiền (VND)</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-3 text-lg font-bold text-blue-600 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0 đ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Ngày chi</label>
                  <input 
                    type="date" required
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
                    {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.Name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Ghi chú</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Cơm trưa..."
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200">Hủy bỏ</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-lg">
                    {editingId ? 'Cập nhật' : 'Lưu giao dịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;