import { useEffect, useState } from 'react';
import warningApi from '../api/warningApi';
import { AlertTriangle } from 'lucide-react';

function WarningPage() {
    const [warnings, setWarnings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate] = useState({ 
        month: new Date().getMonth() + 1, 
        year: new Date().getFullYear() 
    });

    useEffect(() => {
        const fetchWarnings = async () => {
            try {
                const res = await warningApi.check(currentDate.month, currentDate.year);
                // Giả định API trả về danh sách cảnh báo (ví dụ: Budget is overspent)
                setWarnings(res.data);
            } catch (error) {
                console.error("Lỗi khi tải cảnh báo:", error);
                // Trong môi trường production, bạn sẽ xử lý lỗi tốt hơn
            } finally {
                setIsLoading(false);
            }
        };

        fetchWarnings();
    }, [currentDate]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                Cảnh báo Ngân sách Tháng {currentDate.month}/{currentDate.year}
            </h1>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="font-medium text-yellow-800">
                    Trang này hiển thị các cảnh báo khi chi tiêu vượt quá hoặc gần hết ngân sách đã thiết lập (nếu có dữ liệu từ Server).
                </p>
            </div>

            {isLoading ? (
                 <div className="text-center p-8 text-gray-500">Đang tải cảnh báo...</div>
            ) : (
                <div className="space-y-4">
                    {warnings.length > 0 ? (
                        warnings.map((w, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-red-300">
                                <p className="font-semibold text-red-600">{w.CategoryName}: {w.Message}</p>
                                <p className="text-sm text-gray-500">Đã chi: {w.Spent.toLocaleString('vi-VN')} VND / Ngân sách: {w.Budget.toLocaleString('vi-VN')} VND</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-8 bg-green-50 rounded-lg">
                            <p className="text-lg text-green-700 font-medium">🎉 Tháng này chưa có cảnh báo nào! Ngân sách của bạn đang ổn định.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default WarningPage;