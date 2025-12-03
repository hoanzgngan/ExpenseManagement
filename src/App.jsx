import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components chính (Giả định nằm trong thư mục: ./pages)
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Category from './pages/Category'
import TransactionPage from './pages/TransactionPage'
import BudgetPage from './pages/BudgetPage'
import WarningPage from './pages/WarningPage' // Component này đã được bổ sung/tạo

// Components cấu trúc (Giả định nằm trong thư mục: ./components và ./layouts)
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =======================================================
        1. Public Routes: Các trang không yêu cầu đăng nhập
        ======================================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =======================================================
        2. Protected Routes: Các trang yêu cầu token hợp lệ
        ======================================================= */}
        {/* Route cha sử dụng ProtectedRoute để kiểm tra token */}
        <Route element={<ProtectedRoute />}> 
          {/* Route con sử dụng MainLayout để hiển thị Sidebar */}
          <Route element={<MainLayout />}>
            {/* Các trang bên trong Layout */}
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/budgets" element={<BudgetPage />} />
            <Route path="/warnings" element={<WarningPage />} />
          </Route>
        </Route>
        
        {/* =======================================================
        3. 404 Not Found
        ======================================================= */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">404 Not Found</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App