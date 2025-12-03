import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }
  
  // Nếu có token, cho phép render các route con
  return <Outlet />;
}

export default ProtectedRoute;