// src/homepages/Homepages.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Transaction } from '../types'; 
import './Homepages.css'; 

// Import các component con
import BalanceDisplay from '../homepages/BalanceDisplay'; 
import TransactionList from '../homepages/TransactionList';
import AddTransactionForm from '../homepages/AddTransactionForm';
import Sidebar from '../homepages/Sidebar'; 
import StatChart from '../homepages/StatChart'; 

// Định nghĩa các màn hình có thể có
type Screen = 'home' | 'bills' | 'savings' | 'account' | 'fluctuation'; 

interface HomepagesProps {
    onLogout: () => void;
}

// Dữ liệu giả định ban đầu (Mock Data)
const initialTransactions: Transaction[] = [
    { id: 1, description: 'Lương tháng 12', amount: 15000000, date: '2025-12-01', type: 'income' },
    { id: 2, description: 'Ăn uống', amount: -30000, date: '2025-12-01', type: 'expense' },
    { id: 3, description: 'Giáo dục', amount: -500000, date: '2025-11-28', type: 'expense' },
    { id: 4, description: 'Di chuyển', amount: -25000, date: '2025-11-27', type: 'expense' }, 
    { id: 5, description: 'Ăn uống', amount: -50000, date: '2025-11-26', type: 'expense' },
    { id: 6, description: 'Nhà ở & Tiện ích', amount: -2000000, date: '2025-11-25', type: 'expense' },
    { id: 7, description: 'Sức khỏe', amount: -150000, date: '2025-11-24', type: 'expense' },
];

let nextId = initialTransactions.length + 1;

const Homepages: React.FC<HomepagesProps> = ({ onLogout }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [currentScreen, setCurrentScreen] = useState<Screen>('home'); 


    const currentBalance = useMemo(() => {
        return transactions.reduce((acc, trans) => acc + trans.amount, 0);
    }, [transactions]);

    const handleAddTransaction = useCallback((newTransactionData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...newTransactionData,
            id: nextId++,
        };

        setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    }, []);
    
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleScreenChange = (screen: Screen) => {
        setCurrentScreen(screen);
        setIsMenuOpen(false); 
    };
    
    const handleCheckNowClick = () => {
        setCurrentScreen('fluctuation');
    };

    const billTransactions = useMemo(() => {
        return transactions.filter(t => t.type === 'expense');
    }, [transactions]);
    
    const getFeatureName = (screen: Screen) => {
        switch (screen) {
            case 'savings': return 'Gửi Tiết Kiệm';
            case 'account': return 'Tài Khoản'; 
            default: return 'Tính năng khác';
        }
    };

    const renderContent = () => {
        if (currentScreen === 'fluctuation') {
            return (
                <div className="fluctuation-screen-container bill-screen-container">
                    <h2 className="screen-title">📊 Biến động Số dư Ví</h2>
                    <TransactionList transactions={transactions} /> 
                </div>
            );
        }
        
        if (currentScreen === 'bills') {
            return (
                <div className="bill-screen-container">
                    <h2 className="screen-title">🧾 Chi tiết các Khoản Chi tiêu</h2>
                    <TransactionList transactions={billTransactions} />
                </div>
            );
        }
        
        if (currentScreen === 'savings' || currentScreen === 'account') {
            return (
                <div className="placeholder-screen-container bill-screen-container">
                    <h2 className="screen-title" style={{textAlign: 'center'}}>
                        Tính năng {getFeatureName(currentScreen)} đang phát triển...
                    </h2>
                </div>
            );
        }

        // Màn hình Home mặc định
        return (
            <>
                <div className="top-info-row">
                    <BalanceDisplay 
                        balance={currentBalance} 
                        isCompact={true} 
                        onCheckNow={handleCheckNowClick} 
                    />
                    
                    <div className="placeholder-card">
                        <div className="placeholder-content">Điểm danh</div>
                        <div className="placeholder-content">Nhận quà ✨</div>
                    </div>
                </div>

                <div className="forms-and-lists"> 
                    <div className="form-section"> 
                        <AddTransactionForm onAddTransaction={handleAddTransaction} />
                    </div>
                    
                    <div className="list-section"> 
                        <StatChart transactions={transactions} /> 
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="homepages-container"> 
            
            <Sidebar 
                isOpen={isMenuOpen} 
                onClose={toggleMenu} 
                onLogout={onLogout}
                onScreenChange={handleScreenChange} 
            />

            <button 
                className="menu-toggle-button" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {currentScreen !== 'home' ? '🏠' : '☰'}
            </button>

            <h1>{
                currentScreen === 'home' 
                    ? 'Quản Lý Chi Tiêu Cá Nhân' 
                    : 'Chi Tiết'
            }</h1>
            
            {renderContent()}

            <button 
                onClick={onLogout} 
                className="logout-button"
            >
                Đăng xuất
            </button>
        </div>
    );
};

export default Homepages;