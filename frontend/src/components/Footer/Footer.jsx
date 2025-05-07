import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const districts = [
    { id: 1, name: "Hải Châu" },
    { id: 2, name: "Thanh Khê" },
    { id: 3, name: "Sơn Trà" },
    { id: 4, name: "Ngũ Hành Sơn" },
    { id: 5, name: "Cẩm Lệ" },
    { id: 6, name: "Liên Chiểu" },
    { id: 7, name: "Hòa Vang" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Trọ Đà Nẵng</h3>
            </div>
            <p className="text-gray-600">
              Nền tảng tìm kiếm nhà trọ hàng đầu tại Đà Nẵng, kết nối người thuê với chủ trọ một cách nhanh chóng và hiệu quả.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link 
                  to="/article" 
                  className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Danh sách phòng trọ
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Giới thiệu
                </Link>
              </li>
              <li>
                <Link 
                  to="/about#contact" 
                  className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Liên hệ
                </Link>
              </li>
              <li>
                <Link 
                  to="/about#faq" 
                  className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span> Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Search by District */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Tìm kiếm theo quận</h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
              {districts.map((district) => (
                <Link
                  key={district.id}
                  to={`/article?district=${encodeURIComponent(district.name)}`}
                  className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                >
                  <MapPin size={14} className="mr-1" /> {district.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="text-orange-500 w-5 h-5 mr-2 mt-0.5" />
                <p className="text-gray-600">
                  Q. Ngũ Hành Sơn, TP. Đà Nẵng
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="text-orange-500 w-5 h-5 mr-2" />
                <p className="text-gray-600">
                  0236 123 4567
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="text-orange-500 w-5 h-5 mr-2" />
                <p className="text-gray-600">
                  lienhe@trodanang.vn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © {currentYear} Trọ Đà Nẵng. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}