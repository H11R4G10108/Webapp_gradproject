// src/App.jsx
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Navbar from "@/components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
function LandingPage() {
  const navigate = useNavigate();
  const districts = [
    { id: 1, name: "Hải Châu" },
    { id: 2, name: "Thanh Khê" },
    { id: 3, name: "Sơn Trà" },
    { id: 4, name: "Ngũ Hành Sơn" },
    { id: 5, name: "Cẩm Lệ" },
    { id: 6, name: "Liên Chiểu" },
    { id: 7, name: "Hòa Vang" },
  ];

  const handleDistrictClick = (districtName) => {
    navigate(`/article?district=${encodeURIComponent(districtName)}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br px-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://danasun.vn/wp-content/uploads/2022/07/xay-dung-nha-tro-tai-da-nang-8.jpg')",
            height: "85vh",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        {/* Content */}
        <div className="max-w-3xl text-center space-y-6 z-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-sm">
            Trọ Đà Nẵng - Trọ hợp nhu cầu
          </h1>
          <p className="text-lg text-white">
            Kênh thông tin trọ hàng đầu Đà Nẵng
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/article"
              className="px-6 py-3 text-lg rounded-md text-white bg-orange-500 transition-all duration-300 ease-in-out transform hover:scale-125"
            >
              Tìm ngay
            </Link>
          </div>
        </div>
      </div>

      {/* District Section */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
        <h2 className="text-3xl text-gray-800 mb-4">Tìm trọ theo địa điểm!</h2>
        <p>
          Dù là trung tâm hay ven biển, Danang Rent giúp bạn tìm ngay nơi ở lý
          tưởng trong khu vực.
        </p>
        <div className="flex flex-wrap justify-center items-center content-center w-[75%] mt-10 overflow-auto flex-row">
          {districts.map((district) => (
            <Button
              key={district.id}
              onClick={() => handleDistrictClick(district.name)}
              className="bg-white rounded-md py-8 px-4 flex items-center justify-center w-[224px] h-[101px] m-[15px] transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <span className="text-lg text-black font-medium hover:text-orange-500">
                {district.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
