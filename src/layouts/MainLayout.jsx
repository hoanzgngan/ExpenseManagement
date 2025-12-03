import { Outlet, Link } from 'react-router-dom';
import { LogOut, Home, List, DollarSign, Target, AlertTriangle } from 'lucide-react';

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Chuyển hướng cứng để reset ứng dụng
    };

    const navItems = [
        { name: 'Trang chủ', path: '/', icon: Home },
        { name: 'Giao dịch', path: '/transactions', icon: DollarSign },
        { name: 'Danh mục', path: '/categories', icon: List },
        { name: 'Ngân sách', path: '/budgets', icon: Target },
        { name: 'Cảnh báo', path: '/warnings', icon: AlertTriangle },
    ];

    return (
        <div className="flex flex-col w-64 bg-indigo-700 text-white min-h-screen">
            <div className="p-6 text-2xl font-bold border-b border-indigo-600">
                MobiBudget
            </div>
            <nav className="flex-grow p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center p-3 rounded-lg hover:bg-indigo-600 mb-2 transition duration-150"
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-indigo-600">
                <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-lg bg-red-600 w-full justify-center hover:bg-red-700 transition duration-150"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Đăng Xuất
                </button>
            </div>
        </div>
    );
};

function MainLayout() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-grow p-4 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;