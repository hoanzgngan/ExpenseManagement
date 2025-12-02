// src/homepages/TransactionList.tsx

import React from 'react';
import { Transaction } from '../types'; 
import './TransactionList.css'; 

interface ListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<ListProps> = ({ transactions }) => {
  return (
    <div className="transactionHistory">
      <h3>Lịch sử giao dịch</h3>
      <ul className="listGroup">
        {transactions.map((trans) => (
          <li key={trans.id} 
              className={`listItem ${trans.type === 'income' ? "income" : "expense"}`}>
            <span>{trans.description}</span>
            <span className={trans.amount >= 0 ? "amountIncome" : "amountExpense"}>
              {trans.amount.toLocaleString('vi-VN')} VND
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;