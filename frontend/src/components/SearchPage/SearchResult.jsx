import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
import Navbar from "../Navbar/Navbar";
import {AuthContext} from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function SearchResult() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const { searchstring } = useParams();
  const [error, setErrors] = useState("");
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const toggleBookmark = async (postId) => {
    if (!user) {
      Swal.fire({
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để lưu phòng trọ",
        icon: "info",
        confirmButtonText: "Đăng nhập",
        showCancelButton: true,
        cancelButtonText: "Đóng",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      const response = await api.post(
        `${BASE_URL}/api/bookmark-toggle/${postId}/`
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
            icon: "success",
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
            icon: "info",
          });
        }
        return updated;
      });
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
        iconColor: "#f44336",
      });
    }
  };

  const highlightSearchTerm = (text) => {
    if (!searchstring || !text) return text;
    
    // Create a case-insensitive regular expression for the search term
    const regex = new RegExp(`(${searchstring})`, 'gi');
    
    // Split the text by the regex and map through the resulting array
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchstring.toLowerCase()) {
        return <mark key={index} className="bg-yellow-200">{part}</mark>;
      }
      return part;
    });
  };

  const loadPage = async (pageUrl) => {
    setLoading(true);
    try {
      const response = await axios.get(pageUrl);
      
      if (response.data && response.data.results) {
        setPosts(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
        
        // Extract page number from URL if possible
        const pageMatch = pageUrl.match(/page=(\d+)/);
        if (pageMatch && pageMatch[1]) {
          setCurrentPage(parseInt(pageMatch[1]));
        }
      } else {
        console.error("Unexpected API response format:", response.data);
        setPosts([]);
        setErrors("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrors("Failed to load posts.");
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/posts/?search=${searchstring}`
        );
        
        if (response.data && response.data.results) {
          setPosts(response.data.results);
          setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
          });
          setCurrentPage(1);
        } else if (Array.isArray(response.data)) {
          setPosts(response.data);
          setPagination({
            count: response.data.length,
            next: null,
            previous: null,
          });
        } else {
          console.error("Unexpected API response format:", response.data);
          setPosts([]);
          setErrors("Invalid data format received from API.");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrors("Failed to load posts.");
        setPosts([]);
      }
      setLoading(false);
    };

    loadPosts();
  }, [searchstring]);

  // Load bookmarked posts only if user is logged in
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        // Skip fetching bookmarks if user is not logged in
        return;
      }
      
      try {
        const response = await api.get(`${BASE_URL}/api/bookmarks/`);
        if (response.data && Array.isArray(response.data)) {
          const bookmarkedIds = new Set(
            response.data.map(bookmark => bookmark.post)
          );
          setBookmarkedPosts(bookmarkedIds);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        // Don't set an error state here as this is not critical functionality
      }
    };

    fetchBookmarks();
  }, [user]);

  if (loading)
    return (
      <div
        id="loading-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 bg-slate-100"
      >
        <svg
          className="animate-spin h-5 w-5 text-black mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-black text-xl">Loading...</span>
      </div>
    );

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  const formatAmenities = (amenitiesString) => {
    if (!amenitiesString) return [];
    
    try {
      // Remove single quotes and convert to proper JSON format
      const jsonString = amenitiesString.replace(/'/g, '"');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Kết quả tìm kiếm cho "{searchstring}"
        </h1>
        
        {pagination.count > 0 && (
          <p className="text-gray-600 mb-6">
            Tìm thấy {pagination.count} kết quả
          </p>
        )}
        
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl text-gray-700 mb-4">
              Không tìm thấy phòng trọ nào phù hợp với điều kiện tìm kiếm.
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.postid}
                className="border border-gray-100 shadow-md rounded-xl p-5 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500 flex items-center">
                    {new Date(post.p_date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <button
                    onClick={() => toggleBookmark(post.postid)}
                    className="p-1.5 rounded-full hover:bg-orange-50"
                  >
                    {bookmarkedPosts.has(post.postid) ? (
                      <BookmarkSolid className="h-5 w-5 text-orange-500" />
                    ) : (
                      <BookmarkOutline className="h-5 w-5 text-orange-500" />
                    )}
                  </button>
                </div>
                
                <h2 className="text-base mb-3 text-gray-800">
                  {highlightSearchTerm(post.content)}
                </h2>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {post.street_address}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.area && (
                      <span className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-md">
                        {post.area}m²
                      </span>
                    )}
                    
                    {formatAmenities(post.amenities).slice(0, 3).map((amenity, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
                        {amenity}
                      </span>
                    ))}
                    
                    {formatAmenities(post.amenities).length > 3 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                        +{formatAmenities(post.amenities).length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-xl font-bold text-orange-500 mb-4">
                  {formatPrice(post.price)} VNĐ/tháng
                </div>
                
                <Link
                  to={`/article/${post.postid}`}
                  className="block w-full border-2 border-orange-500 text-orange-500 text-center p-2 rounded-md hover:bg-orange-500 hover:text-white transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination controls */}
        {(pagination.next || pagination.previous) && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => pagination.previous && loadPage(pagination.previous)}
              disabled={!pagination.previous}
              className={`px-4 py-2 rounded-lg ${
                pagination.previous 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Trang trước
            </button>
            
            <span className="px-4 py-2 bg-white rounded-lg border">
              Trang {currentPage}
            </span>
            
            <button
              onClick={() => pagination.next && loadPage(pagination.next)}
              disabled={!pagination.next}
              className={`px-4 py-2 rounded-lg ${
                pagination.next 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Trang tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}