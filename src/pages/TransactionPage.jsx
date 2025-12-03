import { useEffect, useState } from 'react'
import transactionApi from '../api/transactionApi'
import categoryApi from '../api/categoryApi'
import { Trash2, PlusCircle } from 'lucide-react'

const formatDate = (isoDate) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('vi-VN')
}

function TransactionPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [newTransaction, setNewTransaction] = useState({ 
    categoryId: '', 
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    note: '' 
  })

  // 1. Fetch dữ liệu
  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        transactionApi.getAll(),
        categoryApi.getAll(),
      ])
      setTransactions(transRes.data)
      setCategories(catRes.data)
    } catch (error) {
      alert('Lỗi khi tải dữ liệu!')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 2. Xử lý Tạo giao dịch
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        // Backend đang mong đợi CategoryID
        categoryId: parseInt(newTransaction.categoryId) 
      }
      
      await transactionApi.create(dataToSend)
      alert('Tạo giao dịch thành công!')
      setNewTransaction({ categoryId: '', amount: '', date: new Date().toISOString().split('T')[0], note: '' })
      fetchData() // Tải lại danh sách
    } catch (error) {
      alert('Lỗi khi tạo giao dịch!')
      console.error(error)
    }
  }

  // 3. Xử lý Xóa giao dịch
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return

    try {
      await transactionApi.delete(id)
      alert('Xóa giao dịch thành công!')
      fetchData() // Tải lại danh sách
    } catch (error) {
      alert('Lỗi khi xóa giao dịch!')
      console.error(error)
    }
  }

  // Phân loại chi tiêu (Expense) và thu nhập (Income)
  const expenseCategories = categories.filter(c => c.Type === 'expense')
  const incomeCategories = categories.filter(c => c.Type === 'income')


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản Lý Giao Dịch</h1>
      
      {/* Form Thêm Giao Dịch */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center"><PlusCircle className='w-5 h-5 mr-2'/> Thêm Giao Dịch Mới</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          
          <select 
            value={newTransaction.categoryId} 
            onChange={(e) => setNewTransaction({ ...newTransaction, categoryId: e.target.value })}
            className="p-2 border rounded col-span-2"
            required
          >
            <option value="">-- Chọn Danh Mục --</option>
            <optgroup label="Chi Tiêu">
                {expenseCategories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.Name} (Chi)</option>)}
            </optgroup>
            <optgroup label="Thu Nhập">
                {incomeCategories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.Name} (Thu)</option>)}
            </optgroup>
          </select>

          <input
            type="number"
            placeholder="Số tiền (VND)"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="p-2 border rounded col-span-1"
            required
          />

          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="p-2 border rounded col-span-1"
            required
          />

          <input
            type="text"
            placeholder="Ghi chú (Tùy chọn)"
            value={newTransaction.note}
            onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
            className="p-2 border rounded col-span-1"
          />

          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200">
            Thêm
          </button>
        </form>
      </div>

      {/* Danh sách Giao Dịch */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Danh Sách Giao Dịch</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh Mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi Chú</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền (VND)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((t) => (
                <tr key={t.TransactionID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(t.TransactionDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.CategoryName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.Note}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.Amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {t.Amount.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(t.TransactionID)}
                      className="text-red-600 hover:text-red-900 ml-3"
                      title="Xóa"
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TransactionPage;