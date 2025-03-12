import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

export default function PostList() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [error, setErrors] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const api = useAxios();

    useEffect(() => {
      const loadPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/posts/?page=${currentPage}`
          );
          setPosts(response.data.results || []);
          setTotalPages(response.data.total_pages);
          setNextPage(response.data.next);
          setPrevPage(response.data.previous);
        } catch (error) {
          console.error("Error fetching posts:", error);
          setErrors("Failed to load posts.");
        }
        setLoading(false);
      };
  
      loadPosts();
    }, [currentPage, sortOption]);

  if (loading) return (
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
  const toggleBookmark = async (postId) => {
    try {
      const response = await api.post(
        `http://127.0.0.1:8000/api/bookmark-toggle/${postId}/`
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Bookmark added",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "bottom",
          showCloseButton: false,
          showConfirmButton: false,
          width: "25em",
        });
      } else if (response.status === 204) {
        Swal.fire({
          title: "Bookmark removed",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "bottom",
          showCloseButton: false,
          showConfirmButton: false,
          width: "25em",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Swal.fire({
        title: "There was an error",
        text: "Please try again",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "bottom-right",
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
      });
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.p_date) - new Date(a.p_date);
    if (sortOption === "oldest") return new Date(a.p_date) - new Date(b.p_date);
    return 0;
  });
  return (
    <div>
      <div className="flex items-center px-20 pt-5">
        <span className="text-gray-500 mr-2">Sort by</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          <option value="latest">Latest articles</option>
          <option value="oldest">Oldest articles</option>
        </select>
      </div>

      <div className="gap-10 grid grid-cols-3 px-20 pt-5">
        {sortedPosts && sortedPosts.map((post, index) => (
          <div
            className="border border-slate-200 shadow-sm h-56 rounded-md p-7 bg-slate-50"
            key={index}
          >
            <div className="flex p-2 justify-between">
            <p className="text-sm font-bold">{new Date(post.p_date).toLocaleTimeString()}{" "}
              {new Date(post.p_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
                         {/* Bookmark Button */}
                <button onClick={() => toggleBookmark(post.postid)}>
                    <BookmarkOutline className="h-5 w-5 text-orange-500" />
                </button>
            </div>
            <div className="p-2 leading-5">
              <h2 className="mb-1 text-xm">
                {post.content.length > 50 ? (
                  <>
                    {post.content.substring(0, 55)}...
                  </>
                ) : (
                  post.content
                )}
              </h2>
            </div>
            <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
              See full post →
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-5 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={!prevPage}
          className={`px-4 py-2 ${prevPage ? "bg-orange-500 hover:bg-orange-700" : "bg-gray-300"
            } text-white rounded`}
        >
          Previous
        </button>


        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!nextPage}
          className={`px-4 py-2 ${nextPage ? "bg-orange-500 hover:bg-orange-700" : "bg-gray-300"
            } text-white rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
