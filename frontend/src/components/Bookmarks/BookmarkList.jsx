import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { BookmarkSlashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useInView } from "react-intersection-observer";
import { 
  ListBulletIcon, 
  Squares2X2Icon, 
  ArrowsUpDownIcon,
  MapPinIcon,
  HomeIcon,
  PhoneIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const BASE_URL = import.meta.env.VITE_API_URL

export default function BookmarkList() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setErrors] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [viewMode, setViewMode] = useState("tiles");
  const [totalPosts, setTotalPosts] = useState(0);
  
  const api = useAxios();
  const { ref, inView } = useInView({ threshold: 1 });
  const { user } = useContext(AuthContext);
  const user_id = user ? user.user_id : null;
  
  useEffect(() => {
    const loadPosts = async () => {
      if (!hasMore) return;
      setLoading(true);
      try {
        const response = await api.get(
          `${BASE_URL}/bookmarks/?userid=${user_id}&page=${currentPage}`
        );
        const newPosts = response.data.results;
        setPosts((prevPosts) => {
          const allPosts = [...prevPosts, ...newPosts];
          // Remove duplicates using a Map
          const uniquePosts = Array.from(new Map(allPosts.map(bookmark => [bookmark.post.postid, bookmark])).values());
          return uniquePosts;
        });
        setTotalPosts(response.data.count);
        setHasMore(!!response.data.next); // Check if there are more pages
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setErrors("Failed to load bookmarks.");
      }
      setLoading(false);
    };

    if (user_id) {
      loadPosts();
    }
  }, [user_id, currentPage]);

  useEffect(() => {
    if (inView && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  const toggleBookmark = async (postId) => {
    try {
      const response = await api.post(`${BASE_URL}/bookmark-toggle/${postId}/`);
      
      if (response.status === 204) {
        // Remove the post from the current list
        setPosts(posts.filter(item => item.post.postid !== postId));
        setTotalPosts(prev => prev - 1);
        
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
          icon: "info"
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
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
        iconColor: "#f44336"
      });
    }
  };

  // Sort posts
  const getSortedPosts = (posts = [], option) => {
    return [...posts].sort((a, b) => {
      if (option === "latest") return new Date(b.post.p_date) - new Date(a.post.p_date);
      if (option === "oldest") return new Date(a.post.p_date) - new Date(b.post.p_date);
      if (option === "price_low") return a.post.price - b.post.price;
      if (option === "price_high") return b.post.price - a.post.price;
      return 0;
    });
  };
  
  const sortedPosts = getSortedPosts(posts, sortOption);
  
  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  // Format price to display with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Danh sách phòng trọ đã lưu
          </h1>
          
          <div className="mb-6 text-lg text-gray-600 max-w-4xl mx-auto">
            Quản lý các phòng trọ bạn đã lưu để tiện theo dõi và so sánh sau này.
          </div>
        </div>

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex items-center gap-2 bg-white rounded-lg border shadow-sm px-4 py-2">
                <ArrowsUpDownIcon className="h-5 w-5 text-orange-500" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-transparent border-none outline-none py-1 pr-8 cursor-pointer text-gray-700"
                >
                  <option value="latest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price_low">Giá: Thấp đến Cao</option>
                  <option value="price_high">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>
            
            <div className="hidden md:flex border rounded-lg overflow-hidden shadow-sm bg-white">
              <button 
                className={`p-2.5 transition flex items-center justify-center w-12 ${viewMode === "tiles" ? "bg-orange-100 text-orange-700" : "bg-white text-gray-500"}`}
                onClick={() => setViewMode("tiles")}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button 
                className={`p-2.5 transition flex items-center justify-center w-12 ${viewMode === "list" ? "bg-orange-100 text-orange-700" : "bg-white text-gray-500"}`} 
                onClick={() => setViewMode("list")}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Display total count */}
        <div className="mb-6 text-gray-600 flex items-center">
          <HomeIcon className="h-5 w-5 mr-2 text-orange-500" />
          <span>Hiển thị <span className="font-semibold">{totalPosts}</span> phòng trọ đã lưu</span>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {loading && currentPage === 1 ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="mb-4">
                  <SkeletonLoader viewMode={viewMode} />
                </div>
              ))
            ) : sortedPosts.length > 0 ? (
              sortedPosts.map((bookmark) => (
                <motion.article
                  key={bookmark.id}
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-100 shadow-md rounded-xl p-5 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5 text-orange-400" />
                      {new Date(bookmark.post.p_date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <button 
                      onClick={() => toggleBookmark(bookmark.post.postid)}
                      className="p-1.5 rounded-full hover:bg-orange-50"
                    >
                      <BookmarkSlashIcon className="h-5 w-5 text-orange-500" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h2 className="text-xl font-bold mb-3 text-gray-800">
                        {bookmark.post.content}
                      </h2>
                      <div className="space-y-3">
                        <p className="flex items-center text-gray-700">
                          <MapPinIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                          <span>{bookmark.post.street_address}, {bookmark.post.ward}, {bookmark.post.district}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <HomeIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                          <span>{bookmark.post.area}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <PhoneIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                          <span>{bookmark.post.contact_info}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div className="text-2xl font-bold text-orange-500 mb-4">
                        {formatPrice(bookmark.post.price)} VNĐ/tháng
                      </div>
                      <Link
                        to={`/article/${bookmark.post.postid}`}
                        className="border-2 border-orange-500 text-orange-500 text-center px-5 py-3 rounded-md hover:bg-orange-500 hover:text-white transition font-medium"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-orange-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-700 mb-4">Bạn chưa có phòng trọ nào được lưu.</p>
                <Link
                  to="/posts"
                  className="mt-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md font-medium"
                >
                  Khám phá các phòng trọ
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tiles View */}
        {viewMode === "tiles" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && currentPage === 1 ? (
              Array(6).fill(0).map((_, index) => (
                <div key={index}>
                  <SkeletonLoader viewMode={viewMode} />
                </div>
              ))
            ) : sortedPosts.length > 0 ? (
              sortedPosts.map((bookmark) => (
                <motion.article
                  key={bookmark.id}
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-100 shadow-md rounded-xl overflow-hidden bg-white h-full flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5 text-orange-400" />
                        {new Date(bookmark.post.p_date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <button 
                        onClick={() => toggleBookmark(bookmark.post.postid)}
                        className="p-1.5 rounded-full hover:bg-orange-50"
                      >
                        <BookmarkSlashIcon className="h-5 w-5 text-orange-500" />
                      </button>
                    </div>
                    
                    <h2 className="text-lg font-bold mb-3 line-clamp-2 text-gray-800">
                      {bookmark.post.content}
                    </h2>
                    
                    <div className="space-y-3 mb-4">
                      <p className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                        <span className="truncate">{bookmark.post.district}</span>
                      </p>
                      <p className="flex items-center text-gray-700">
                        <HomeIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                        <span>{bookmark.post.ward}</span>
                      </p>
                    </div>
                    
                    <div className="text-xl font-bold text-orange-500 mb-4">
                      {formatPrice(bookmark.post.price)} VNĐ/tháng
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <Link
                      to={`/article/${bookmark.post.postid}`}
                      className="block border-2 border-orange-500 text-orange-500 text-center px-4 py-3 rounded-sm hover:bg-orange-500 hover:text-white transition font-medium"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-orange-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-700 mb-4">Bạn chưa có phòng trọ nào được lưu.</p>
                <Link
                  to="/posts"
                  className="mt-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md font-medium inline-block"
                >
                  Khám phá các phòng trọ
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Loading indicator for infinite scroll */}
        {hasMore && (
          <div className="mt-12" ref={ref}>
            <div className="flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-orange-500 rounded-full h-2 w-2"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
                className="bg-orange-500 rounded-full h-2 w-2 mx-2"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
                className="bg-orange-500 rounded-full h-2 w-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}