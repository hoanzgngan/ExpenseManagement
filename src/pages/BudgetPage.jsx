import { useEffect, useState } from 'react'
import budgetApi from '../api/budgetApi'
import categoryApi from '../api/categoryApi'
import { PlusCircle, Target, Trash2 } from 'lucide-react'

const getMonthYear = () => {
  const date = new Date()
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }
}

function BudgetPage() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [currentDate, setCurrentDate] = useState(getMonthYear())
  const [newBudget, setNewBudget] = useState({ 
    categoryId: '', 
    amount: '', 
    month: currentDate.month, 
    year: currentDate.year 
  })

  // 1. Fetch dữ liệu
  const fetchData = async () => {
    try {
      const [budgetRes, catRes] = await Promise.all([
        budgetApi.getByMonth(currentDate.month, currentDate.year),
        categoryApi.getAll(),
      ])
      setBudgets(budgetRes.data)
      setCategories(catRes.data.filter(c => c.Type === 'expense')) // Chỉ lấy category chi tiêu cho budget
    } catch (error) {
      alert('Lỗi khi tải dữ liệu ngân sách!')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentDate])

  // 2. Xử lý Thêm/Cập nhật ngân sách
  const handleUpsert = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...newBudget,
        amount: parseFloat(newBudget.amount),
        categoryId: newBudget.categoryId === 'total' ? null : parseInt(newBudget.categoryId),
        month: currentDate.month,
        year: currentDate.year
      }
      
      await budgetApi.upsert(dataToSend)
      alert('Ngân sách đã được cập nhật thành công!')
      setNewBudget({ categoryId: '', amount: '', month: currentDate.month, year: currentDate.year })
      fetchData() // Tải lại danh sách
    } catch (error) {
      alert('Lỗi khi thiết lập ngân sách!')
      console.error(error)
    }
  }

  // 3. Xử lý Xóa ngân sách
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) return

    try {
      await budgetApi.delete(id)
      alert('Xóa ngân sách thành công!')
      fetchData() // Tải lại danh sách
    } catch (error) {
      alert('Lỗi khi xóa ngân sách!')
      console.error(error)
    }
  }

  // Lấy tên danh mục
  const getCategoryName = (categoryId) => {
    if (categoryId === null) return 'Tổng Chi Tiêu (Chung)'
    const cat = categories.find(c => c.CategoryID === categoryId)
    return cat ? cat.Name : 'Không xác định'
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản Lý Ngân Sách</h1>
      
      {/* Chọn Tháng/Năm */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4">
        <label className="text-lg font-medium">Ngân sách cho tháng:</label>
        <input
            type="number"
            value={currentDate.month}
            onChange={(e) => setCurrentDate({ ...currentDate, month: parseInt(e.target.value) || 1 })}
            min="1"
            max="12"
            className="p-2 border rounded w-16 text-center"
        />
        <label className="text-lg font-medium">Năm:</label>
        <input
            type="number"
            value={currentDate.year}
            onChange={(e) => setCurrentDate({ ...currentDate, year: parseInt(e.target.value) || 2025 })}
            min="2000"
            className="p-2 border rounded w-20 text-center"
        />
      </div>


      {/* Form Thiết Lập Ngân Sách */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center"><Target className='w-5 h-5 mr-2'/> Thiết Lập Ngân Sách</h2>
        <form onSubmit={handleUpsert} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <select 
            value={newBudget.categoryId} 
            onChange={(e) => setNewBudget({ ...newBudget, categoryId: e.target.value })}
            className="p-2 border rounded col-span-2"
            required
          >
            <option value="">-- Chọn Danh Mục / Tổng Chi --</option>
            <option value="total">Tổng Chi Tiêu (Chung)</option>
            <optgroup label="Theo Danh Mục">
                {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.Name}</option>)}
            </optgroup>
          </select>

          <input
            type="number"
            placeholder="Số tiền Ngân sách (VND)"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            className="p-2 border rounded col-span-1"
            required
          />

          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200">
            Cập Nhật Ngân Sách
          </button>
        </form>
      </div>

      {/* Danh sách Ngân Sách đã thiết lập */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Ngân Sách đã thiết lập ({currentDate.month}/{currentDate.year})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh Mục</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền Ngân Sách (VND)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.length > 0 ? (
                budgets.map((b) => (
                  <tr key={b.BudgetID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {getCategoryName(b.CategoryID)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-blue-600">
                      {b.BudgetAmount.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(b.BudgetID)}
                        className="text-red-600 hover:text-red-900 ml-3"
                        title="Xóa"
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        Chưa có ngân sách nào được thiết lập cho tháng này.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BudgetPage