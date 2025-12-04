import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  PiggyBank,
  BarChart3,
  LogOut,
  Wallet,
  AlertTriangle,
  X,
  Menu
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? 'bg-blue-800 text-white'
        : 'text-blue-100 hover:bg-blue-800/50'
    }`;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-blue-700 text-white transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-blue-600">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Wallet className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-lg font-bold">EXPENSE</h1>
              <span className="text-sm text-blue-200">Management</span>
            </div>
          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex flex-col p-3 space-y-2">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={20} />
          {isOpen && 'Tổng quan'}
        </NavLink>

        <NavLink to="/transactions" className={navClass}>
          <History size={20} />
          {isOpen && 'Lịch sử chi tiêu'}
        </NavLink>

        <NavLink to="/budgets" className={navClass}>
          <PiggyBank size={20} />
          {isOpen && 'Ngân sách & Danh mục'}
        </NavLink>

        <NavLink to="/reports" className={navClass}>
          <BarChart3 size={20} />
          {isOpen && 'Thống kê báo cáo'}
        </NavLink>

        <NavLink to="/warnings" className={navClass}>
          <AlertTriangle size={20} />
          {isOpen && 'Cảnh báo rủi ro'}
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-600">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-3 px-4 py-2 text-red-500 hover:bg-red-500/20 rounded-lg"
        >
          <LogOut size={20} />
          {isOpen && 'Đăng xuất'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;