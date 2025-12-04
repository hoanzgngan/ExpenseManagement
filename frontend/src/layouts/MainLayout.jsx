import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const MainLayout = () => {
  const { isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex-1 p-8 transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
