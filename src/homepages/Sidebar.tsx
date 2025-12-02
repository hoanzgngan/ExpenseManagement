// src/homepages/Sidebar.tsx

import React from 'react';
import './Sidebar.css'; 

type Screen = 'home' | 'bills' | 'savings' | 'account' | 'fluctuation'; 

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onScreenChange: (screen: Screen) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout, onScreenChange }) => {
    const menuItems: { name: string; screen: Screen }[] = [
        { name: '🏠 Trang chủ', screen: 'home' },
        { name: '🧾 Hóa đơn', screen: 'bills' },
        { name: '💰 Gửi tiết kiệm', screen: 'savings' },
        { name: '👤 Tài khoản', screen: 'account' }, 
        { name: '📈 Biến động', screen: 'fluctuation' },
    ];

    const handleItemClick = (screen: Screen) => {
        onScreenChange(screen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebarHeader">
                 <button className="closeButton" onClick={onClose}>×</button>
            </div>
            
            <ul className="menuList">
                {menuItems.map((item) => (
                    <li key={item.screen} onClick={() => handleItemClick(item.screen)}>
                        {item.name}
                    </li>
                ))}
            </ul>

            <button className="sidebarLogoutButton" onClick={onLogout}>
                Đăng xuất
            </button>
        </div>
    );
};

export default Sidebar;