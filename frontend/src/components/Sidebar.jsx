import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, PiggyBank, BarChart3, LogOut, Wallet, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-blue-800 text-white font-medium' : 'text-blue-100 hover:bg-blue-800/50'
    }`;

  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen text-white bg-blue-700">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-blue-600">
        <div className="p-2 bg-white rounded-lg">
          <Wallet className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">Expense</h1>
          <span className="text-sm text-blue-200">Management</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={20} /> Tổng quan
        </NavLink>
        <NavLink to="/transactions" className={navClass}>
          <History size={20} /> Lịch sử chi tiêu
        </NavLink>
        <NavLink to="/budgets" className={navClass}>
          <PiggyBank size={20} /> Ngân sách & Danh mục
        </NavLink>
        <NavLink to="/reports" className={navClass}>
          <BarChart3 size={20} /> Thống kê báo cáo
        </NavLink>
        <NavLink to="/warnings" className={navClass}>
           <AlertTriangle size={20} /> Cảnh báo rủi ro
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-600">
        <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 text-red-200 transition-colors rounded-lg hover:text-white hover:bg-red-500/20">
          <LogOut size={20} /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;