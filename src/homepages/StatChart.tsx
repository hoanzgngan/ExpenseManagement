// src/homepages/StatChart.tsx

import React, { useMemo } from 'react';
import { Transaction } from '../types';
import './StatChart.css'; 

interface StatChartProps {
    transactions: Transaction[];
}

const aggregateExpenseData = (transactions: Transaction[]) => {
    const expenseData = transactions.filter(t => t.type === 'expense');

    const aggregatedMap = expenseData.reduce((acc, transaction) => {
        const key = transaction.description; 
        const amount = Math.abs(transaction.amount);

        acc[key] = (acc[key] || 0) + amount;
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(aggregatedMap).map(key => ({
        name: key,
        value: aggregatedMap[key],
    }));
};

const StatChart: React.FC<StatChartProps> = ({ transactions }) => {
    const data = useMemo(() => aggregateExpenseData(transactions), [transactions]);
    
    const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    return (
        <div className="statChartContainer">
            <h4>📈 Thống kê Chi tiêu (Biểu đồ Dịch vụ)</h4>
            
            {totalExpense === 0 ? (
                <p className="noData">Chưa có dữ liệu chi tiêu để thống kê.</p>
            ) : (
                <div className="chartAndLegend">
                    <div className="pieChartPlaceholder">
                         <p className="totalLabel">Tổng: {totalExpense.toLocaleString('vi-VN')} VND</p>
                        {/* Hình ảnh minh họa biểu đồ tròn cho chi tiêu */}
                        

[Image of a Pie Chart showing expense categories]

                    </div>

                    {/* Danh sách chú giải (Legend) */}
                    <ul className="chartLegend">
                        {data.map((item, index) => {
                            const percent = (item.value / totalExpense * 100).toFixed(1);
                            const color = colors[index % colors.length];
                            
                            return (
                                <li key={item.name} className="legendItem">
                                    <span 
                                        className="legendColor" 
                                        style={{ backgroundColor: color }}
                                    ></span>
                                    <span className="legendName">{item.name}</span>
                                    <span className="legendPercent">({percent}%)</span>
                                    <span className="legendValue">{item.value.toLocaleString('vi-VN')} VND</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StatChart;