// src/homepages/BalanceDisplay.tsx

import React from 'react';
import './BalanceDisplay.css'; 

interface BalanceProps {
  balance: number;
  isCompact: boolean;
  onCheckNow: () => void;
}

const BalanceDisplay: React.FC<BalanceProps> = ({ balance, isCompact, onCheckNow }) => {
    const formattedBalance = balance.toLocaleString('vi-VN');
    const balanceClass = balance >= 0 ? "textSuccess" : "textDanger";
    
    // Logic cho chế độ compact trên màn hình Home
    if (isCompact) {
        // Giả định một khoản thu nhập lớn để tính toán "Chi tiêu tháng"
        const monthlyIncome = 15000000; 
        const monthlyExpenseEstimate = balance > monthlyIncome ? 0 : monthlyIncome - balance; 

        return (
            <div className="balanceCard">
                <div className="balanceHeader">
                  <h3>Ví cá nhân</h3>
                  <span className="settingIcon">⚙️</span>
                </div>
                <div className={balanceClass}>
                    <h2 className="balanceAmount">{formattedBalance} VND</h2>
                </div>
                {/* Visual placeholder cho graph */}
                <div className="graphPlaceholder"></div> 
                
                <div className="checkNowButton" onClick={onCheckNow}>
                    <span>Kiểm tra ngay <span role="img" aria-label="arrow">→</span></span>
                    {/* Hiển thị chi tiêu ước tính */}
                    <span style={{color: monthlyExpenseEstimate > 0 ? '#ffb3b3' : 'white'}}>
                        Chi tiêu tháng: {monthlyExpenseEstimate.toLocaleString('vi-VN')} VND
                    </span>
                </div>
            </div>
        );
    }
    
    // Chế độ cơ bản (dự phòng)
    return (
        <div className="balanceCard">
          <h3>Số dư hiện tại</h3>
          <div className={balanceClass}>
            <h2>{formattedBalance} VND</h2>
          </div>
        </div>
    );
};

export default BalanceDisplay;