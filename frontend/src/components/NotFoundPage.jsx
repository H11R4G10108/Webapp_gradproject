import { Home } from 'lucide-react';

export default function NotFound() {  
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            
            <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="text-9xl font-bold text-orange-500 leading-none">4</div>
                    <div className="relative mx-2">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-9xl font-bold text-orange-500 leading-none">4</div>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">Không tìm thấy trang</h1>
                <p className="text-center text-gray-600 mb-6">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chính.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/" className="w-full sm:w-auto">
                        <button className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                            <Home size={18} />
                            <span>Trang chủ</span>
                        </button>
                    </a>
                </div>
                
            </div>
        </div>
        
    </div>
);
}