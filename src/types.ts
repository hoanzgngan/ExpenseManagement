// src/types.ts

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: number;
    description: string;
    amount: number; // Âm cho Chi tiêu, Dương cho Thu nhập
    date: string; // Định dạng YYYY-MM-DD
    type: TransactionType;
}

export interface Category {
    id: number;
    name: string;
    type: TransactionType;
}