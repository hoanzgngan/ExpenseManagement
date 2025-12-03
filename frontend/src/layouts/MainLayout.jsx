import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/authStore';

const MainLayout = () => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;