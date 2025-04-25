import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
import Navbar from "../Navbar/Navbar";

export default function SearchResult() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const { searchstring } = useParams();
  const [error, setErrors] = useState("");
  const api = useAxios();

  const toggleBookmark = async (postId) => {
    try {
      const response = await api.post(
        `http://127.0.0.1:8000/api/bookmark-toggle/${postId}/`
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

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/post-detail/?search=" + searchstring
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrors("Failed to load posts.");
      }
      setLoading(false);
    };

    loadPosts();
  }, [searchstring]);

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

  if (error) return <p>{error}</p>;
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Kết quả tìm kiếm cho "{searchstring}"
        </h1>
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl text-gray-700 mb-4">
              Không tìm thấy phòng trọ nào phù hợp với điều kiện tìm kiếm.
            </p>
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
                    {bookmarkedPosts?.has(post.postid) ? (
                      <BookmarkSolid className="h-5 w-5 text-orange-500" />
                    ) : (
                      <BookmarkOutline className="h-5 w-5 text-orange-500" />
                    )}
                  </button>
                </div>
                <h2 className="text-base mb-3 text-gray-800">{post.content}</h2>
                <div className="space-y-3">
                </div>
                <div className="text-xl font-bold text-orange-500 mb-7">
                  {formatPrice(post.price)} VNĐ/tháng
                </div>
                <Link
                  to={`/article/${post.postid}`}
                  className="border-2 border-orange-500 text-orange-500 text-center p-2 rounded-md hover:bg-orange-500 hover:text-white transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}