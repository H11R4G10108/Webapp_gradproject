import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { 
  ListBulletIcon, 
  Squares2X2Icon, 
  FunnelIcon,
  MapPinIcon,
  HomeIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowsUpDownIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { Slider } from "@/components/ui/slider";
import BackToTop from "@/components/ui/backtotop";
import SearchBar from "../SearchPage/SearchBar";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function PostList() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setErrors] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [sortOption, setSortOption] = useState("latest");
  const [viewMode, setViewMode] = useState("tiles");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    districts: [],
    priceMin: "",
    priceMax: "",
  });
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Default price range in VND
  const [filtersReady, setFiltersReady] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const api = useAxios();
  const { ref, inView } = useInView({ threshold: 1 });
  const user_id = user ? user.user_id : null;

  const districts = [
    { id: 1, name: "Hải Châu" },
    { id: 2, name: "Thanh Khê" },
    { id: 3, name: "Sơn Trà" },
    { id: 4, name: "Ngũ Hành Sơn" },
    { id: 5, name: "Cẩm Lệ" },
    { id: 6, name: "Liên Chiểu" },
    { id: 7, name: "Hòa Vang" },
  ];

  // Max price for slider (10 million VND)
  const MAX_PRICE = 10000000;

  // Handle district filter changes
  const handleDistrictChange = (districtName) => {
    setFilters(prev => {
      const districts = prev.districts.includes(districtName)
        ? prev.districts.filter(d => d !== districtName)
        : [...prev.districts, districtName];
      return { ...prev, districts };
    });
  };

  // Handle price range slider change
  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
    setFilters(prev => ({
      ...prev,
      priceMin: values[0] > 0 ? values[0].toString() : "",
      priceMax: values[1] < MAX_PRICE ? values[1].toString() : ""
    }));
  };

  // Remove district filter tag
  const removeDistrictFilter = (districtName) => {
    setFilters(prev => ({
      ...prev,
      districts: prev.districts.filter(d => d !== districtName)
    }));
  };

  // Construct query params for API
  const getQueryParams = () => {
    const params = new URLSearchParams();
    
    // Add district filters
    if (filters.districts.length > 0) {
      params.append('district', filters.districts.join(','));
    }
    
    // Add price range filters
    if (filters.priceMin) {
      params.append('price_min', filters.priceMin);
    }
    if (filters.priceMax) {
      params.append('price_max', filters.priceMax);
    }
    
    // Add pagination
    params.append('page', currentPage);
    
    return params.toString();
  };

  // Apply filters and reset pagination
  const applyFilters = () => {
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
    // This will trigger the loadPosts effect
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      districts: [],
      priceMin: "",
      priceMax: ""
    });
    setPriceRange([0, MAX_PRICE]);
    applyFilters();
  };

  const loadPosts = useCallback(async () => {
    if (!filtersReady || !hasMore) return; // Only load posts when filters are ready
    setLoading(true);
  
    try {
      const queryParams = getQueryParams();
      const response = await axios.get(
        `${BASE_URL}/posts/?${queryParams}`
      );
  
      setPosts((prevPosts) => {
        if (currentPage === 1) {
          return response.data.results;
        }
        const allPosts = [...prevPosts, ...response.data.results];
        return Array.from(new Map(allPosts.map((post) => [post.postid, post])).values());
      });
  
      setTotalPosts(response.data.count); // Update total posts count
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrors("Failed to load rental listings.");
    }
  
    setLoading(false);
  }, [currentPage, hasMore, filtersReady, filters]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const district = queryParams.get("district");

    if (district) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        districts: [district],
      }));
      setFiltersReady(true); // Mark filters as ready after updating
    } else {
      setFiltersReady(true); // Mark filters as ready even if no district is provided
    }
  }, [location.search]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (inView && hasMore) {
      setCurrentPage((prev) => (hasMore ? prev + 1 : prev));
    }
  }, [inView, hasMore]);

  // Fetch bookmarked posts
  const loadBookmarkedPosts = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/bookmark-for-check/?userid=${user_id}`
      );
      const bookmarkData = response.data || [];
      const bookmarkedIds = new Set(
        bookmarkData
          .filter((item) => item.post)
          .map((item) => item.post.postid)
      );
      setBookmarkedPosts(bookmarkedIds);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      loadBookmarkedPosts();
    }
  }, [user_id]);

  // Toggle bookmark
  const toggleBookmark = async (postId) => {
    try {
      const response = await api.post(
        `${BASE_URL}/bookmark-toggle/${postId}/`
      );

      setBookmarkedPosts((prev) => {
        const updated = new Set(prev);
        if (response.status === 201) {
          updated.add(postId);
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
            icon: "success"
          });
        } else if (response.status === 204) {
          updated.delete(postId);
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
        return updated;
      });
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
        iconColor: "#f44336"
      });
    }
  };

  // Sort posts
  const getSortedPosts = (posts = [], option) => {
    return [...posts].sort((a, b) => {
      if (option === "latest") return new Date(b.p_date) - new Date(a.p_date);
      if (option === "oldest") return new Date(a.p_date) - new Date(b.p_date);
      if (option === "price_low") return a.price - b.price;
      if (option === "price_high") return b.price - a.price;
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

  // Has active filters
  const hasActiveFilters = filters.districts.length > 0 || filters.priceMin || filters.priceMax;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 flex justify-center items-center flex-col">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Tìm trọ theo địa điểm
          </h1>
          
          <div className="mb-6 text-lg text-gray-600 max-w-4xl mx-auto">
            Dù là trung tâm hay ven biển, Trọ Đà Nẵng giúp bạn tìm ngay nơi ở lý tưởng trong khu vực.
          </div>
          <SearchBar />

        </div>
        {/* Filter Toggle & Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md"
          >
            <FunnelIcon className="h-5 w-5" />
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </button>
          
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

        {/* Filters Panel */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl mb-8 shadow-md border-orange-100 border-2"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-orange-500" />
              Bộ lọc tìm kiếm
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* District Filter */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700 border-l-4 border-orange-500 pl-3">Quận</h3>
                <div className="grid grid-cols-2 gap-2">
                  {districts.map((district) => (
                    <div key={district.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`district-${district.id}`}
                        checked={filters.districts.includes(district.name)}
                        onChange={() => handleDistrictChange(district.name)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded-md focus:ring-orange-500 mr-2"
                      />
                      <label htmlFor={`district-${district.id}`} className="text-gray-600">{district.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Slider */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700 border-l-4 border-orange-500 pl-3">Khoảng giá (VNĐ)</h3>
                <div className="px-3 py-6">
                  <Slider
                    defaultValue={[0, MAX_PRICE]}
                    value={priceRange}
                    min={0}
                    max={MAX_PRICE}
                    step={100000}
                    onValueChange={handlePriceRangeChange}
                    className="mb-6"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="block text-gray-500 mb-1">Từ:</span>
                      <span className="font-semibold text-gray-800">{formatPrice(priceRange[0])} VNĐ</span>
                    </div>
                    <div className="text-sm text-right">
                      <span className="block text-gray-500 mb-1">Đến:</span>
                      <span className="font-semibold text-gray-800">
                        {priceRange[1] >= MAX_PRICE ? "10,000,000+" : formatPrice(priceRange[1])} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={resetFilters}
                className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg mr-3 hover:bg-gray-300 transition font-medium"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={applyFilters}
                className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition shadow-sm font-medium"
              >
                Áp dụng
              </button>
            </div>
          </motion.div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.districts.map(district => (
                <div 
                  key={district} 
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center text-sm"
                >
                  <span>Quận: {district}</span>
                  <button 
                    onClick={() => {
                      removeDistrictFilter(district);
                      applyFilters();
                    }}
                    className="ml-2 p-0.5 hover:bg-orange-200 rounded-full"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {filters.priceMin && (
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center text-sm">
                  <span>Giá từ: {formatPrice(filters.priceMin)} VNĐ/tháng</span>
                  <button 
                    onClick={() => {
                      setPriceRange([0, priceRange[1]]);
                      setFilters({...filters, priceMin: ""});
                      applyFilters();
                    }}
                    className="ml-2 p-0.5 hover:bg-orange-200 rounded-full"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {filters.priceMax && (
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center text-sm">
                  <span>Giá đến: {formatPrice(filters.priceMax)} VNĐ/tháng</span>
                  <button 
                    onClick={() => {
                      setPriceRange([priceRange[0], MAX_PRICE]);
                      setFilters({...filters, priceMax: ""});
                      applyFilters();
                    }}
                    className="ml-2 p-0.5 hover:bg-orange-200 rounded-full"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <button
                onClick={resetFilters}
                className="text-orange-700 hover:text-orange-800 text-sm flex items-center ml-2"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Display total count */}
        <div className="mb-6 text-gray-600 flex items-center">
          <HomeIcon className="h-5 w-5 mr-2 text-orange-500" />
          <span>Hiển thị <span className="font-semibold">{totalPosts}</span> phòng trọ</span>
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
            ) : (
              sortedPosts.map((post) => (
                <motion.article
                  key={post.postid}
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-100 shadow-md rounded-xl p-5 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5 text-orange-400" />
                      {new Date(post.p_date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    {user_id && (
                      <button 
                        onClick={() => toggleBookmark(post.postid)}
                        className="p-1.5 rounded-full hover:bg-orange-50"
                      >
                        {bookmarkedPosts?.has(post.postid) ? (
                          <BookmarkSolid className="h-5 w-5 text-orange-500" />
                        ) : (
                          <BookmarkOutline className="h-5 w-5 text-orange-500" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h2 className="text-base mb-3 text-gray-800">
                        {post.content}
                      </h2>
                      <div className="space-y-3">
                        <p className="flex items-center text-gray-700">
                          <MapPinIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                          <span>{post.street_address}, {post.ward}, {post.district}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <HomeIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                          <span>{post.area}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <PhoneIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                          <span>{post.contact_info}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between">
                      <div className="text-xl font-bold text-orange-500 mb-4">
                        {formatPrice(post.price)} VNĐ/tháng
                      </div>
                      <Link
                        to={`/article/${post.postid}`}
                        className="border-2 border-orange-500 text-orange-500 text-center px-5 py-3 rounded-md hover:bg-orange-500 hover:text-white transition"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        )}

        {/* tiles View */}
        {viewMode === "tiles" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && currentPage === 1 ? (
              Array(6).fill(0).map((_, index) => (
                <div key={index}>
                  <SkeletonLoader viewMode={viewMode} />
                </div>
              ))
            ) : (
              sortedPosts.map((post) => (
                <motion.article
                  key={post.postid}
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                  className="border border-gray-100 shadow-md rounded-xl overflow-hidden bg-white h-full flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5 text-orange-400" />
                        {new Date(post.p_date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      {user_id && (
                        <button 
                          onClick={() => toggleBookmark(post.postid)}
                          className="p-1.5 rounded-full hover:bg-orange-50"
                        >
                          {bookmarkedPosts?.has(post.postid) ? (
                            <BookmarkSolid className="h-5 w-5 text-orange-500" />
                          ) : (
                            <BookmarkOutline className="h-5 w-5 text-orange-500" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <h2 className="text-lg mb-3 line-clamp-2 text-gray-800">
                    {post.content.length > 50 ? `${post.content.substring(0, 75)}...` : post.content}
                    </h2>
                    
                    <div className="space-y-3 mb-4">
                      <p className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                        <span className="truncate">{post.district}</span>
                      </p>
                      <p className="flex items-center text-gray-700">
                        <HomeIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                        <span>{post.ward}</span>
                      </p>
                    </div>
                    
                    <div className="text-xl font-bold text-orange-500 mb-4">
                      {formatPrice(post.price)} VNĐ/tháng
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <Link
                        to={`/article/${post.postid}`}
                        className="block border-2 border-orange-500 text-orange-500 text-center px-4 py-3 rounded-sm hover:bg-orange-500 hover:text-white transition font-medium"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.article>
              ))
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
        
        {/* No results message */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-orange-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-700 mb-4">Không tìm thấy phòng trọ nào phù hợp với điều kiện tìm kiếm.</p>
            <button
              onClick={() => {
                setFilters({
                  districts: [],
                  priceMin: "",
                  priceMax: ""
                });
                applyFilters();
              }}
              className="mt-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow-md font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
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