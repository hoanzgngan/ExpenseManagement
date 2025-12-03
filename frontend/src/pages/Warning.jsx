import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { AlertTriangle, CheckCircle, TrendingUp, HelpCircle } from 'lucide-react';

const Warning = () => {
  const [data, setData] = useState(null);
  const date = new Date();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getWarnings(date.getMonth() + 1, date.getFullYear());
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-500">Đang phân tích dữ liệu...</div>;

  //  Nhóm Vượt ngân sách (Chi > Ngân sách)
  const overBudgetItems = data.byCategory.filter(c => {
    const spent = Number(c.spent);
    const budget = Number(c.budget);
    return spent > budget;
  });

  //  Nhóm Rủi ro cao (Chưa vượt, nhưng đã chi >= 80% ngân sách)
  const riskItems = data.byCategory.filter(c => {
    const spent = Number(c.spent);
    const budget = Number(c.budget);
    if (spent > budget) return false; // Đã nằm ở nhóm trên
    if (budget === 0) return false;   // Không có ngân sách thì không tính %
    return (spent / budget) >= 0.8;   // >= 80% là báo động
  });

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="max-w-5xl pb-10 mx-auto">
      <h1 className="flex items-center gap-2 mb-2 text-2xl font-bold text-gray-800">
        <AlertTriangle className="text-orange-500" /> Trung tâm Cảnh báo & Rủi ro
      </h1>
      <p className="mb-8 text-gray-500">Phân tích tài chính tháng {date.getMonth() + 1}/{date.getFullYear()}</p>

      {/* --- PHẦN 1: CẢNH BÁO TỔNG QUAN --- */}
      {data.total.isOver ? (
        <div className="p-6 mb-8 duration-500 border-l-4 border-red-500 shadow-sm bg-red-50 rounded-r-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start">
            <div className="p-2 mr-4 bg-white rounded-full shadow-sm">
                <AlertTriangle className="text-red-500" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700">Báo động: Tổng chi tiêu vượt mức!</h3>
              <p className="mt-2 text-lg text-red-600">
                Bạn đã chi <span className="font-bold">{formatMoney(data.total.totalSpent)}</span>, 
                vượt quá ngân sách <span className="font-bold">{formatMoney(data.total.totalBudget)}</span>.
              </p>
              <div className="inline-block px-4 py-2 mt-4 font-bold text-red-500 bg-white border border-red-200 rounded-lg shadow-sm">
                Số tiền vượt: {formatMoney(data.total.totalSpent - data.total.totalBudget)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 mb-8 border-l-4 border-green-500 shadow-sm bg-green-50 rounded-r-xl">
          <div className="flex items-center">
            <CheckCircle className="mr-4 text-green-600" size={32} />
            <div>
              <h3 className="text-xl font-bold text-green-700">Tình hình tài chính ổn định</h3>
              <p className="mt-1 text-green-600">Bạn đang kiểm soát chi tiêu rất tốt.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* --- PHẦN 2: DANH SÁCH VƯỢT MỨC --- */}
        <div>
           <h2 className="flex items-center gap-2 pb-2 mb-4 text-lg font-bold text-gray-800 border-b">
             <div className="w-2 h-8 bg-red-500 rounded-full"></div>
             Danh mục cần chú ý ({overBudgetItems.length})
           </h2>
           
           {overBudgetItems.length > 0 ? (
             <div className="space-y-4">
               {overBudgetItems.map(item => {
                 const isNoBudget = item.budget === 0;
                 return (
                    <div key={item.CategoryID} className="relative p-5 overflow-hidden transition-all bg-white border border-red-100 shadow-sm rounded-xl group hover:shadow-md">
                        {/* Thanh màu đỏ bên trái */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                        
                        <div className="flex items-start justify-between pl-3 mb-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-800">{item.CategoryName}</span>
                                    {isNoBudget && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">Chưa có ngân sách</span>}
                                </div>
                                <div className="mt-1 text-sm text-gray-500">
                                    Định mức: <span className="font-medium">{formatMoney(item.budget)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded">Vượt quá</span>
                                <div className="mt-1 text-xl font-bold text-red-600">{formatMoney(item.spent - item.budget)}</div>
                            </div>
                        </div>
                        
                        {/* Progress Bar đỏ rực */}
                        <div className="w-full bg-red-100 h-1.5 rounded-full mt-2 ml-3 w-[calc(100%-12px)]">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                 )
               })}
             </div>
           ) : (
             <div className="p-8 text-center border-2 border-gray-200 border-dashed bg-gray-50 rounded-xl">
               <CheckCircle className="mx-auto mb-3 text-gray-300" size={40}/>
               <p className="font-medium text-gray-500">Không có danh mục nào vượt mức.</p>
             </div>
           )}
        </div>

        {/* --- PHẦN 3: DANH SÁCH RỦI RO (SẮP VƯỢT) --- */}
        <div>
           <h2 className="flex items-center gap-2 pb-2 mb-4 text-lg font-bold text-gray-800 border-b">
             <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
             Nguy cơ cao &gt; 80% ({riskItems.length})
           </h2>
           
           {riskItems.length > 0 ? (
             <div className="space-y-4">
               {riskItems.map(item => {
                 const percent = Math.round((item.spent / item.budget) * 100);
                 return (
                    <div key={item.CategoryID} className="p-5 pl-6 transition-all bg-white border border-orange-100 shadow-sm rounded-xl hover:shadow-md">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-800">{item.CategoryName}</span>
                            <span className="px-2 py-1 text-sm font-bold text-orange-600 rounded bg-orange-50">{percent}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                            <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between p-2 text-xs text-gray-500 rounded-lg bg-orange-50/50">
                            <span>Đã dùng: <strong className="text-orange-700">{formatMoney(item.spent)}</strong></span>
                            <span>Còn lại: <strong className="text-green-600">{formatMoney(item.budget - item.spent)}</strong></span>
                        </div>
                    </div>
                 )
               })}
             </div>
           ) : (
             <div className="p-8 text-center border-2 border-gray-200 border-dashed bg-gray-50 rounded-xl">
               <TrendingUp className="mx-auto mb-3 text-gray-300" size={40}/>
               <p className="font-medium text-gray-500">Các danh mục khác vẫn trong tầm kiểm soát an toàn.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Warning;