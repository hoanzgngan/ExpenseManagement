// src/homepages/AddTransactionForm.tsx

import React, { useState } from 'react';
import { Transaction } from '../types'; 
import './AddTransactionForm.css'; 

interface FormProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionForm: React.FC<FormProps> = ({ onAddTransaction }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return alert('Vui lòng điền đầy đủ thông tin.');

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) return alert('Số tiền phải là số dương.');

        const finalAmount = type === 'expense' ? -numericAmount : numericAmount;

        onAddTransaction({
            description,
            amount: finalAmount,
            date: new Date().toISOString().split('T')[0],
            type,
        });

        setDescription('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="formAddTransaction">
            <h4>Thêm giao dịch mới</h4>
            <input
                type="text"
                placeholder="Mô tả (ví dụ: Tiền ăn trưa)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Số tiền (VND)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
                <option value="expense">Chi tiêu</option>
                <option value="income">Thu nhập</option>
            </select>
            <button type="submit">Thêm giao dịch</button>
        </form>
    );
};

export default AddTransactionForm;