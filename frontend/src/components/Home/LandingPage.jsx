import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import BackToTop from "@/components/ui/backtotop";

function LandingPage() {
  const navigate = useNavigate();
  
  const districts = [
    { 
      id: 1, 
      name: "Hải Châu", 
      image: "https://images2.thanhnien.vn/528068263637045248/2024/6/19/2-r-1718791886665772660374.jpg",
      description: "Trung tâm hành chính, kinh tế của thành phố"
    },
    { 
      id: 2, 
      name: "Thanh Khê", 
      image: "https://vietnamtourism.vn/imguploads/tourist/15Quanthanhkhe01.jpg",
      description: "Khu vực sầm uất với nhiều tiện ích"
    },
    { 
      id: 3, 
      name: "Sơn Trà", 
      image: "https://ik.imagekit.io/tvlk/blog/2022/09/ban-dao-son-tra-3-1024x550.jpg?tr=q-70,c-at_max,w-500,h-300,dpr-2", 
      description: "Khu vực gần biển và bán đảo Sơn Trà"
    },
    { 
      id: 4, 
      name: "Ngũ Hành Sơn", 
      image: "https://ik.imagekit.io/tvlk/blog/2022/07/ngu-hanh-son-da-nang-1.jpg",
      description: "Khu vực du lịch với danh thắng Ngũ Hành Sơn"
    },
    { 
      id: 5, 
      name: "Cẩm Lệ", 
      image: "https://camle.danang.gov.vn/documents/10184/55713/5_cv.jpg/5f179c31-1dac-436e-969a-744e2c378d20?version=1.1&t=1508900541000&imageThumbnail=0",
      description: "Khu vực phát triển năng động"
    },
    { 
      id: 6, 
      name: "Liên Chiểu", 
      image: "https://image.sggp.org.vn/w1000/Uploaded/2025/chukplu/2020_07_28/2402_YEPZ.jpg.webp",
      description: "Khu công nghiệp và dân cư mới"
    },
    { 
      id: 7, 
      name: "Hòa Vang", 
      image: "https://img.lsvn.vn/vne-news/June2024/z5582535056803_aa5db0c6ca45e35cd7bbf1a96a1d38e4.jpg",
      description: "Huyện ngoại thành với thiên nhiên xanh"
    },
  ];

  const handleDistrictClick = (districtName) => {
    navigate(`/article?district=${encodeURIComponent(districtName)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute w-full h-full bg-fixed bg-center bg-cover"
          style={{
            backgroundImage: "url('https://danasun.vn/wp-content/uploads/2022/07/xay-dung-nha-tro-tai-da-nang-8.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-6">
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 text-shadow-sm">
            Trọ Đà Nẵng
            <span className="block text-orange-400 mt-2 text-shadow-md">Trọ hợp nhu cầu</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Kênh thông tin nhà trọ hàng đầu Đà Nẵng - Giúp bạn tìm kiếm nơi ở phù hợp, 
            tiện nghi với chi phí hợp lý nhất
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/article"
              className="px-8 py-4 text-lg font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/50"
            >
              Tìm Ngay
            </Link>
            
            <Link
              to="/about"
              className="px-8 py-4 text-lg font-medium rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-all shadow-lg"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      
      {/* District Section */}
      <div className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tìm trọ theo quận huyện
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dù là trung tâm sầm uất, gần trường học hay ven biển yên bình, 
              Trọ Đà Nẵng giúp bạn tìm ngay nơi ở lý tưởng trong khu vực mong muốn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district) => (
              <div 
                key={district.id}
                onClick={() => handleDistrictClick(district.name)}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-w-16 aspect-h-9 h-64">
                  <img 
                    src={district.image} 
                    alt={district.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {district.name}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {district.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-orange-400 group-hover:text-orange-300">
                    Xem nhà trọ
                    <svg className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tại sao chọn Trọ Đà Nẵng?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp những giải pháp tối ưu cho nhu cầu tìm nhà trọ tại Đà Nẵng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tìm kiếm dễ dàng</h3>
              <p className="text-gray-600">Tìm kiếm nhà trọ theo quận huyện, mức giá và tiện ích một cách nhanh chóng</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cập nhật liên tục</h3>
              <p className="text-gray-600">Thông tin nhà trọ mới được cập nhật hàng ngày, đảm bảo bạn không bỏ lỡ cơ hội</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Đảm bảo chất lượng</h3>
              <p className="text-gray-600">Thông tin chính xác, hình ảnh thực tế giúp bạn an tâm lựa chọn</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 px-4 md:px-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng tìm nhà trọ ưng ý?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
            Hàng trăm lựa chọn phù hợp với nhu cầu và ngân sách của bạn đang chờ đợi
          </p>
          <Link
            to="/article"
            className="inline-block px-8 py-4 text-lg font-medium rounded-lg bg-white text-orange-600 transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            Tìm kiếm ngay
          </Link>
        </div>
      </div>
      
      <Footer />
      <BackToTop 
      threshold={400}
      position="bottom-right"
      backgroundColor="bg-orange-500"
      hoverColor="hover:bg-orange-600"
      size="md"
    />
    </div>
  );
}

export default LandingPage;