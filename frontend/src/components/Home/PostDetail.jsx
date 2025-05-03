import { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import {
  ArrowLeftIcon,
  BookmarkIcon as BookmarkOutline,
  PhoneIcon,
  MapPinIcon,
  Squares2X2Icon,
  BanknotesIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "../../assets/icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import Navbar from "../Navbar/Navbar";
const markerIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [35, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [position, setPosition] = useState([16.047079, 108.20623]); // Default position: Da Nang
  const [mapLoaded, setMapLoaded] = useState(false);
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const userId = user ? user.user_id : null;
  const mapRef = useRef(null);

  // Fetch post details
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/post-detail/${postId}/`);
        setPost(response.data);

        // Extract coordinates if available
        if (response.data.latitude && response.data.longitude) {
          setPosition([response.data.latitude, response.data.longitude]);
        } else {
          // If no coordinates, try to geocode the address
          geocodeAddress(response.data);
        }

        // Check if post is bookmarked if user is logged in
        if (userId) {
          checkBookmarkStatus();
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Không thể tải thông tin phòng trọ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId, userId]);

  // Attempt to geocode the address if coordinates aren't provided
  const geocodeAddress = async (postData) => {
    if (!postData) return;

    const address = `${postData.street_address}, ${postData.ward}, ${postData.district}, Đà Nẵng, Việt Nam`;

    try {
      // Using Nominatim OpenStreetMap geocoding service
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: address,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "TroDaNang Website",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        // Fallback to district-level coordinates
        getDistrictCoordinates(postData.district);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      // Fallback to district-level coordinates
      getDistrictCoordinates(postData.district);
    }
  };

  // Fallback coordinates for districts in Da Nang
  const getDistrictCoordinates = (district) => {
    const districtCoordinates = {
      "Hải Châu": [16.0472, 108.2099],
      "Thanh Khê": [16.0639, 108.1844],
      "Sơn Trà": [16.1065, 108.2537],
      "Ngũ Hành Sơn": [16.021, 108.248],
      "Cẩm Lệ": [16.0058, 108.2008],
      "Liên Chiểu": [16.0981, 108.1385],
      "Hòa Vang": [16.0639, 108.0132],
    };

    setPosition(districtCoordinates[district] || [16.047079, 108.20623]);
  };

  // Update map when position changes
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.setView(position, 15);
    }
  }, [position, mapLoaded]);

  // Check if post is bookmarked
  const checkBookmarkStatus = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/bookmark-for-check/?userid=${userId}`
      );
      const bookmarks = response.data || [];
      const isBookmarked = bookmarks.some(
        (bookmark) => bookmark.post && bookmark.post.postid === parseInt(postId)
      );
      setIsBookmarked(isBookmarked);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    if (!userId) {
      Swal.fire({
        title: "Bạn cần đăng nhập",
        text: "Vui lòng đăng nhập để lưu phòng trọ",
        icon: "info",
        confirmButtonText: "Đăng nhập",
        showCancelButton: true,
        cancelButtonText: "Đóng",
        background: "#ED936A",
        iconColor: "#ff7043",
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to login page
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      const response = await api.post(`${BASE_URL}/bookmark-toggle/${postId}/`);

      if (response.status === 201) {
        setIsBookmarked(true);
        Swal.fire({
          title: "Đã lưu phòng trọ",
          toast: true,
          timer: 3000,
          position: "bottom",
          showCloseButton: false,
          showConfirmButton: false,
          width: "25em",
          background: "#fff3e0",
          iconColor: "#ff7043",
          icon: "success",
        });
      } else if (response.status === 204) {
        setIsBookmarked(false);
        Swal.fire({
          title: "Đã xóa khỏi danh sách lưu",
          toast: true,
          timer: 3000,
          position: "bottom",
          showCloseButton: false,
          showConfirmButton: false,
          width: "25em",
          background: "#fff3e0",
          iconColor: "#ff7043",
          icon: "info",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Có lỗi xảy ra",
        text: "Vui lòng thử lại sau",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "bottom-right",
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
        background: "#fff3e0",
        iconColor: "#f44336",
      });
    }
  };

  // Format price to display with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Share post
  const sharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.content,
          text: `Phòng trọ tại ${post?.street_address}, ${post?.ward}, ${post?.district}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        Swal.fire({
          title: "Đã sao chép liên kết",
          toast: true,
          timer: 3000,
          position: "bottom",
          showCloseButton: false,
          showConfirmButton: false,
          width: "25em",
          background: "#fff3e0",
          iconColor: "#ff7043",
          icon: "success",
        });
      });
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex space-x-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-orange-500 rounded-full h-3 w-3"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="bg-orange-500 rounded-full h-3 w-3"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="bg-orange-500 rounded-full h-3 w-3"
            />
          </div>
          <p className="mt-4 text-gray-600">Đang tải thông tin phòng trọ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/article"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md font-medium inline-flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
          <div className="text-orange-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy thông tin
          </h2>
          <p className="text-gray-600 mb-6">
            Phòng trọ này không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/article"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md font-medium inline-flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-gray-500 text-sm">
            <li className="flex items-center">
              <Link to="/" className="hover:text-orange-500">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/article" className="hover:text-orange-500">
                Phòng trọ
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-orange-500 truncate max-w-xs">
              {post.content}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-sm font-bold text-gray-800 mb-2">
                    {post.content}
                  </h1>
                  <div className="flex space-x-2">
                    <button
                      onClick={sharePost}
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      title="Chia sẻ"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={toggleBookmark}
                      className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      title={isBookmarked ? "Đã lưu" : "Lưu phòng trọ"}
                    >
                      {isBookmarked ? (
                        <BookmarkSolid className="h-5 w-5 text-orange-500" />
                      ) : (
                        <BookmarkOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.district}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.ward}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.area}
                  </span>
                </div>

                <div className="text-2xl font-bold text-orange-500">
                  {formatPrice(post.price)} VNĐ/tháng
                </div>
              </div>

              {/* Post Details */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Thông tin chi tiết
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-3 text-orange-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        Địa chỉ
                      </span>
                      <span className="text-gray-800 font-medium">
                        {post.street_address}, {post.ward}, {post.district}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <BanknotesIcon className="h-5 w-5 mr-3 text-orange-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        Giá phòng
                      </span>
                      <span className="text-gray-800 font-medium">
                        {formatPrice(post.price)} VNĐ/tháng
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Squares2X2Icon className="h-5 w-5 mr-3 text-orange-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        Diện tích
                      </span>
                      <span className="text-gray-800 font-medium">
                        {post.area}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-3 text-orange-500" />
                    <div>
                      <span className="text-gray-600 block text-sm">
                        Ngày đăng
                      </span>
                      <span className="text-gray-800 font-medium">
                        {formatDate(post.p_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Mô tả chi tiết
                </h2>

                <div className="prose max-w-none mb-8">
                  <p className="whitespace-pre-line text-gray-700">
                    {post.description || "Không có mô tả chi tiết"}
                  </p>
                </div>

                {/* Utilities Section  */}
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Tiện ích
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {post.amenities ? (
                    (() => {
                      // Parse the amenities string into an array
                      let amenitiesArray = [];
                      try {
                        // Handle the string format that looks like an array
                        if (typeof post.amenities === "string") {
                          // Remove the single quotes inside the string and parse as JSON
                          const cleanedString = post.amenities.replace(
                            /'/g,
                            '"'
                          );
                          amenitiesArray = JSON.parse(cleanedString);
                        } else if (Array.isArray(post.amenities)) {
                          amenitiesArray = post.amenities;
                        }
                      } catch (error) {
                        console.error("Error parsing amenities:", error);
                      }

                      return amenitiesArray.length > 0 ? (
                        amenitiesArray.map((utility, index) => (
                          <div key={index} className="flex items-center">
                            <svg
                              className="h-5 w-5 text-green-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700">{utility}</span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-gray-500">
                          Không có thông tin về tiện ích
                        </div>
                      );
                    })()
                  ) : (
                    <div className="col-span-full text-gray-500">
                      Không có thông tin về tiện ích
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {/* Map Section with Leaflet */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-orange-500" />
                Vị trí trên bản đồ
              </h2>
              <div className="h-80 rounded-lg overflow-hidden">
                <MapContainer
                  center={position}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  whenCreated={(map) => {
                    mapRef.current = map;
                    setMapLoaded(true);
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position} icon={markerIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong className="block mb-1">{post.content}</strong>
                        <span className="text-sm block">
                          {formatPrice(post.price)} VNĐ/tháng
                        </span>
                        <span className="text-xs text-gray-500 block mt-1">
                          {post.street_address}, {post.ward}, {post.district}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="mt-4 text-sm text-gray-500 italic flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 inline text-orange-500" />
                <span className="text-xs">
                  Vị trí hiển thị trên bản đồ có thể không chính xác 100%
                </span>
              </div>
            </div>
            {/* Contact Information */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  Thông tin liên hệ
                </h2>
                <p className="text-gray-500 text-sm">
                  Liên hệ ngay để thuê phòng
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <UserIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">
                      Người cho thuê
                    </span>
                    <span className="font-medium text-gray-800">
                      {post.owner_name || "Chủ nhà"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <PhoneIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm block">
                      Số điện thoại
                    </span>
                    <span className="font-medium text-gray-800">
                      {post.contact_info}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${post.contact_info}`}
                  className="block w-full bg-orange-500 text-white text-center px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium mb-3"
                >
                  Gọi ngay
                </a>

                <a
                  href={`sms:${post.contact_info}`}
                  className="block w-full border-2 border-orange-500 text-orange-500 text-center px-6 py-3 rounded-lg hover:bg-orange-50 transition font-medium"
                >
                  Nhắn tin
                </a>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden mt-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Chỉ đường</h2>
              </div>

              <div className="p-6">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium mb-3"
                >
                  Chỉ đường bằng Google Maps
                </a>

                <a
                  href={`https://www.openstreetmap.org/directions?from=&to=${position[0]}%2C${position[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border-2 border-blue-500 text-blue-500 text-center px-6 py-3 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  Chỉ đường bằng OpenStreetMap
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back to list button */}
        <div className="mt-8 text-center">
          <Link
            to="/article"
            className="inline-flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại danh sách phòng trọ
          </Link>
        </div>
      </div>
    </div>
  );
}
