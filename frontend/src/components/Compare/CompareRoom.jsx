import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Swal from "sweetalert2";
import { 
  TrashIcon,
  ArrowsPointingOutIcon,
  PlusCircleIcon,
  XMarkIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  SquaresPlusIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function CompareRoom() {
  const [compareItems, setCompareItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [maxCompareReached, setMaxCompareReached] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookmarkedRooms, setBookmarkedRooms] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("all");
  
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const user_id = user ? user.user_id : null;
  
  // List of features that could be compared
  const features = [
    { id: "all", name: "Tất cả" },
    { id: "price", name: "Giá thuê" },
    { id: "area", name: "Diện tích" },
    { id: "location", name: "Vị trí" }
  ];
  
  useEffect(() => {
    // Load comparison list from localStorage
    const loadCompareRooms = () => {
      try {
        const storedRooms = localStorage.getItem('compareRooms');
        if (storedRooms) {
          const parsedRooms = JSON.parse(storedRooms);
          setCompareItems(parsedRooms);
          setMaxCompareReached(parsedRooms.length >= 3);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading comparison rooms:", error);
        setError("Không thể tải danh sách so sánh");
        setLoading(false);
      }
    };
    
    loadCompareRooms();
    
    // If user is logged in, load their bookmarked rooms
    if (user_id) {
      loadBookmarkedRooms();
    }
  }, [user_id]);
  
  // Load user's bookmarked rooms
  const loadBookmarkedRooms = async () => {
    try {
      const response = await api.get(`${BASE_URL}/bookmarks/?userid=${user_id}&page=1`);
      const bookmarkData = response.data.results || [];
      // Filter out any rooms already in the compare list
      const bookmarkedPosts = bookmarkData.map(item => item.post);
      const filteredBookmarks = bookmarkedPosts.filter(
        post => !compareItems.some(item => item.postid === post.postid)
      );
      setBookmarkedRooms(filteredBookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };
  
  // Add a room to comparison
  const addToCompare = (room) => {
    if (compareItems.length >= 3) {
      setMaxCompareReached(true);
      Swal.fire({
        title: "Chỉ được so sánh tối đa 3 phòng",
        text: "Vui lòng xóa một phòng khác để tiếp tục",
        icon: "warning",
        confirmButtonColor: "#ef6c00",
      });
      return;
    }
    
    // Check if room is already in the list
    if (compareItems.some(item => item.postid === room.postid)) {
      Swal.fire({
        title: "Phòng này đã có trong danh sách so sánh",
        icon: "info",
        confirmButtonColor: "#ef6c00",
      });
      return;
    }
    
    const updatedList = [...compareItems, room];
    setCompareItems(updatedList);
    localStorage.setItem('compareRooms', JSON.stringify(updatedList));
    setMaxCompareReached(updatedList.length >= 3);
    
    Swal.fire({
      title: "Đã thêm vào danh sách so sánh",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "bottom",
      showCloseButton: false,
      showConfirmButton: false,
      background: "#fff3e0",
      iconColor: "#ef6c00"
    });
    
    setShowAddModal(false);
  };
  
  // Remove a room from comparison
  const removeFromCompare = (postId) => {
    const updatedList = compareItems.filter(item => item.postid !== postId);
    setCompareItems(updatedList);
    localStorage.setItem('compareRooms', JSON.stringify(updatedList));
    setMaxCompareReached(updatedList.length >= 3);
    
    // Refresh bookmarked rooms list
    if (user_id) {
      loadBookmarkedRooms();
    }
    
    Swal.fire({
      title: "Đã xóa khỏi danh sách so sánh",
      icon: "info",
      toast: true,
      timer: 3000,
      position: "bottom",
      showCloseButton: false,
      showConfirmButton: false,
      background: "#fff3e0",
      iconColor: "#ef6c00"
    });
  };
  
  // Clear all comparison items
  const clearAllCompare = () => {
    Swal.fire({
      title: "Xóa tất cả phòng trọ khỏi danh sách so sánh?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef6c00",
      cancelButtonColor: "#78909c",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        setCompareItems([]);
        localStorage.removeItem('compareRooms');
        setMaxCompareReached(false);
        
        Swal.fire({
          title: "Đã xóa tất cả phòng trọ khỏi danh sách so sánh",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "bottom",
          showCloseButton: false,
          showConfirmButton: false,
          background: "#fff3e0",
          iconColor: "#ef6c00"
        });
      }
    });
  };
  
  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };
  
  // Handle feature filter change
  const handleFeatureChange = (feature) => {
    setSelectedFeature(feature);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex space-x-2">
          <div className="bg-orange-500 rounded-full w-3 h-3 animate-bounce"></div>
          <div className="bg-orange-500 rounded-full w-3 h-3 animate-bounce delay-100"></div>
          <div className="bg-orange-500 rounded-full w-3 h-3 animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            So sánh phòng trọ
          </h1>
          <div className="mb-6 text-lg text-gray-600 max-w-4xl mx-auto">
            So sánh các phòng trọ để lựa chọn nơi ở phù hợp nhất với nhu cầu của bạn
          </div>
        </div>
        
        {/* Feature Filter Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 inline-flex p-1">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureChange(feature.id)}
                className={`px-4 py-2 text-sm rounded-md transition ${selectedFeature === feature.id 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-700 hover:bg-orange-50'}`}
              >
                {feature.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <ArrowsRightLeftIcon className="h-5 w-5 mr-2 text-orange-500" />
              Đang so sánh {compareItems.length} phòng trọ
            </h2>
          </div>
          
          <div className="flex space-x-3">
            {compareItems.length > 0 && (
              <button 
                onClick={clearAllCompare}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-red-400 hover:text-white transition"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                Xóa tất cả
              </button>
            )}
            
            <button 
              onClick={() => !maxCompareReached && setShowAddModal(true)}
              className={`flex items-center px-4 py-2 ${!maxCompareReached ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-lg transition shadow-sm`}
              disabled={maxCompareReached}
            >
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Thêm phòng
            </button>
          </div>
        </div>
        
        {/* Main Comparison Table */}
        {compareItems.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-6 px-3 text-left text-lg text-gray-700 w-1/4">
                    Thông tin so sánh
                  </th>
                  
                  {compareItems.map((room) => (
                    <th key={room.postid} className="py-6 px-3 text-left w-1/4">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">ID: {room.postid}</span>
                          <button 
                            onClick={() => removeFromCompare(room.postid)}
                            className="p-1 hover:bg-red-50 rounded-full text-red-500"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <h3 className=" font-medium  text-gray-800 mb-1">
                        {room.content.length > 50 ? `${room.content.substring(0, 55)}...` : room.content}
                        </h3>
                        <Link 
                          to={`/article/${room.postid}`}
                          className="text-orange-500 text-sm hover:underline"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </th>
                  ))}
                  
                  {/* Empty columns for layout with fewer than 3 items */}
                  {Array(3 - compareItems.length).fill(0).map((_, index) => (
                    <th key={`empty-${index}`} className="py-6 px-3 w-1/4">
                      <div className="flex justify-center items-center h-full">
                        <button 
                          onClick={() => setShowAddModal(true)}
                          className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-300 text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          <PlusCircleIcon className="h-10 w-10 mb-2" />
                          <span>Thêm phòng</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Price Row - Always visible */}
                {(selectedFeature === 'all' || selectedFeature === 'price') && (
                  <tr className="hover:bg-orange-50">
                    <td className="py-4 px-3 text-gray-700 font-medium flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-orange-500" />
                      Giá thuê
                    </td>
                    
                    {compareItems.map((room) => (
                      <td key={`price-${room.postid}`} className="py-4 px-3">
                        <div className="text-lg font-bold text-orange-500">
                          {formatPrice(room.price)} VNĐ
                        </div>
                      </td>
                    ))}
                    
                    {/* Empty cells for layout */}
                    {Array(3 - compareItems.length).fill(0).map((_, index) => (
                      <td key={`empty-price-${index}`} className="py-4 px-3"></td>
                    ))}
                  </tr>
                )}
                
                {/* Area Row */}
                {(selectedFeature === 'all' || selectedFeature === 'area') && (
                  <tr className="hover:bg-orange-50">
                    <td className="py-4 px-3 text-gray-700 font-medium flex items-center">
                      <HomeIcon className="h-5 w-5 mr-2 text-orange-500" />
                      Diện tích
                    </td>
                    
                    {compareItems.map((room) => (
                      <td key={`area-${room.postid}`} className="py-4 px-3">
                        <div className="text-md font-medium text-gray-800">
                          {room.area || "Không có thông tin"}
                        </div>
                      </td>
                    ))}
                    
                    {Array(3 - compareItems.length).fill(0).map((_, index) => (
                      <td key={`empty-area-${index}`} className="py-4 px-3"></td>
                    ))}
                  </tr>
                )}
                
                {/* Location Row */}
                {(selectedFeature === 'all' || selectedFeature === 'location') && (
                  <tr className="hover:bg-orange-50">
                    <td className="py-4 px-3 text-gray-700 font-medium flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-2 text-orange-500" />
                      Địa điểm
                    </td>
                    
                    {compareItems.map((room) => (
                      <td key={`location-${room.postid}`} className="py-4 px-3">
                        <div className="text-md font-medium text-gray-800">
                          {room.street_address}, {room.ward}, {room.district}
                        </div>
                      </td>
                    ))}
                    
                    {Array(3 - compareItems.length).fill(0).map((_, index) => (
                      <td key={`empty-location-${index}`} className="py-4 px-3"></td>
                    ))}
                  </tr>
                )}
                
                {/* Contact Row */}
                {(selectedFeature === 'all' || selectedFeature === 'location') && (
                  <tr className="hover:bg-orange-50">
                    <td className="py-4 px-3 text-gray-700 font-medium flex items-center">
                      <PhoneIcon className="h-5 w-5 mr-2 text-orange-500" />
                      Liên hệ
                    </td>
                    
                    {compareItems.map((room) => (
                      <td key={`contact-${room.postid}`} className="py-4 px-3">
                        <div className="text-md font-medium text-gray-800">
                          {room.contact_info || "Không có thông tin"}
                        </div>
                      </td>
                    ))}
                    
                    {Array(3 - compareItems.length).fill(0).map((_, index) => (
                      <td key={`empty-contact-${index}`} className="py-4 px-3"></td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-orange-500 mb-4">
              <SquaresPlusIcon className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-xl text-gray-700 mb-4">Chưa có phòng trọ nào để so sánh</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md font-medium"
            >
              Thêm phòng trọ để so sánh
            </button>
          </div>
        )}
      </div>
      
      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Thêm phòng trọ để so sánh</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {user_id ? (
                bookmarkedRooms.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-gray-700 mb-4">Chọn từ các phòng trọ đã lưu:</p>
                    
                    {bookmarkedRooms.map((room) => (
                      <div 
                        key={room.postid}
                        className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition cursor-pointer"
                        onClick={() => addToCompare(room)}
                      >
                        <div className="flex justify-between">
                  {room.content.length > 50 ? `${room.content.substring(0, 55)}...` : room.content}
                          <span className="text-orange-500">{formatPrice(room.price)} VNĐ/tháng</span>
                        </div>
                        <p className="text-sm text-gray-600">{room.district}, {room.ward}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-600 mb-4">Bạn chưa lưu phòng trọ nào.</p>
                    <Link
                      to="/article"
                      className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                    >
                      Khám phá phòng trọ
                    </Link>
                  </div>
                )
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">Vui lòng đăng nhập để thêm phòng trọ vào danh sách so sánh.</p>
                  <Link
                    to="/login"
                    className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition mr-2"
              >
                Đóng
              </button>
              <Link
                to="/article"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Tìm thêm phòng trọ
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}