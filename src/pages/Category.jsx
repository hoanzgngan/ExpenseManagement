import { useEffect, useState } from 'react'
// SỬA LỖI: Import default export categoryApi
import categoryApi from '../api/categoryApi.js' 
import { List } from 'lucide-react'

function Category() {
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // SỬA LỖI: Gọi categoryApi.getAll()
        const res = await categoryApi.getAll()
        setList(res.data)
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error)
        // alert('Không thể tải danh mục.')
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <List className="w-6 h-6 mr-3 text-indigo-600" />
        Quản lý Danh mục
      </h1>
      
      <div className="space-y-4">
        {list.length > 0 ? (
            list.map((c) => (
                <div 
                    key={c.CategoryID} 
                    // Phân biệt màu sắc cho Thu (income) và Chi (expense)
                    className={`p-4 rounded-lg shadow-md border ${c.Type === 'income' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
                >
                    <p className="font-semibold text-lg">{c.CategoryName}</p>
                    <p className={`text-sm font-medium ${c.Type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        Loại: {c.Type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                    </p>
                </div>
            ))
        ) : (
             <p className="text-center p-4 text-gray-500 bg-white rounded-lg shadow">Không có danh mục nào được tìm thấy.</p>
        )}
      </div>
    </div>
  )
}

export default Category