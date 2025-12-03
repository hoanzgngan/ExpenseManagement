import { useEffect, useState } from 'react';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Chào mừng trở lại, {user?.name || 'Người dùng'}! 👋</h1>
      <p className="text-lg text-gray-600 mb-8">Đây là trang tổng quan tài chính cá nhân của bạn.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Số dư hiện tại */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Số dư hiện tại</h2>
          <p className="text-3xl font-bold text-indigo-600">Đang cập nhật...</p>
          <p className="text-sm text-gray-500 mt-2">Tính đến hôm nay</p>
        </div>

        {/* Card 2: Chi tiêu tháng này */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Chi tiêu tháng {new Date().getMonth() + 1}</h2>
          <p className="text-3xl font-bold text-red-600">Đang cập nhật...</p>
          <p className="text-sm text-gray-500 mt-2">Tổng chi tiêu đã ghi nhận</p>
        </div>
        
        {/* Card 3: Ngân sách còn lại */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Ngân sách còn lại</h2>
          <p className="text-3xl font-bold text-green-600">Đang cập nhật...</p>
          <p className="text-sm text-gray-500 mt-2">Ngân sách tổng đã thiết lập</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <p className="text-gray-500">Sử dụng thanh điều hướng bên trái để quản lý giao dịch, danh mục và ngân sách.</p>
      </div>
    </div>
  )
}

export default Home