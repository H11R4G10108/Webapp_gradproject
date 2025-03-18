import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { jwtDecode } from "jwt-decode";

export default function PostList() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setErrors] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set()); // ✅ Use Set
  const [sortOption, setSortOption] = useState("latest");
  const api = useAxios();
  const { ref, inView } = useInView({ threshold: 1 });

  const token = localStorage.getItem("authTokens");
  let user_id = 0;
  if (token) {
    const decode = jwtDecode(token);
    user_id = decode.userid;
  }

  useEffect(() => {
    const loadPosts = async () => {
      if (!hasMore) return;
      setLoading(true);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/posts/?page=${currentPage}`
        );

        // Convert array to a Set to remove duplicates
        const newPosts = response.data.results;
        setPosts((prevPosts) => {
          const allPosts = [...prevPosts, ...newPosts];
          // Remove duplicates using a Map
          const uniquePosts = Array.from(new Map(allPosts.map(post => [post.postid, post])).values());
          return uniquePosts;
        });

        setHasMore(!!response.data.next);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrors("Failed to load posts.");
      }

      setLoading(false);
    };

    loadPosts();
  }, [currentPage]);


  useEffect(() => {
    if (inView && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  // Fetch bookmarked posts
  useEffect(() => {
    const loadBookmarkedPosts = async () => {
      try {
        const response = await api.get(
          `http://127.0.0.1:8000/api/bookmark-for-check/?userid=${user_id}`
        );

        console.log("API Response:", response.data);
        const bookmarkData = response.data || [];
        const bookmarkedIds = new Set(
          bookmarkData
            .filter((item) => item.post) // Ensure item.post exists
            .map((item) => item.post.postid) // Extract postid
        );
        console.log("Extracted Bookmarked IDs:", bookmarkedIds);
        setBookmarkedPosts(bookmarkedIds);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    if (user_id) {
      loadBookmarkedPosts();
    }
  }, [user_id]);

  // Toggle bookmark
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
            title: "Bookmark added",
            toast: true,
            timer: 3000,
            position: "bottom",
            showCloseButton: false,
            showConfirmButton: false,
            width: "25em",
          });
        } else if (response.status === 204) {
          updated.delete(postId);
          Swal.fire({
            title: "Bookmark removed",
            toast: true,
            timer: 3000,
            position: "bottom",
            showCloseButton: false,
            showConfirmButton: false,
            width: "25em",
          });
        }
        return updated;
      });
    } catch (error) {
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

  // Sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.p_date) - new Date(a.p_date);
    if (sortOption === "oldest") return new Date(a.p_date) - new Date(b.p_date);
    return 0;
  });

  // Skeleton Loader
  const SkeletonLoader = () => {
    return (
      <div className="border border-gray-200 shadow-sm h-56 w-full rounded-md p-7 bg-gray-100">
        <div className="flex justify-between p-2">
          <Skeleton width={80} height={16} />
          <Skeleton width={24} height={24} circle />
        </div>
        <div className="p-2 space-y-2">
          <Skeleton height={20} width="70%" />
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="85%" />
        </div>
        <Skeleton height={14} width={120} />
      </div>
    );
  };

  return (
    <div>
      <div>
        {!loading && (
          <div className="flex px-20 pt-5">
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
        )}
        <div className="gap-10 grid grid-cols-3 px-20 pt-5">
          {sortedPosts && sortedPosts.map((post, index) => (
            <div
              className="border border-slate-200 shadow-sm h-56 rounded-md p-7 bg-slate-50"
              key={index}
            >
              <div className="flex p-2 justify-between">
                <p className="text-sm font-bold">
                  {new Date(post.p_date).toLocaleTimeString()}{" "}
                  {new Date(post.p_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <button onClick={() => toggleBookmark(post.postid)}>
                  {bookmarkedPosts?.has(post.postid) ? (
                    <BookmarkSolid className="h-5 w-5 text-orange-500" />
                  ) : (
                    <BookmarkOutline className="h-5 w-5 text-orange-500" />
                  )}
                </button>
              </div>
              <div className="p-2 leading-5">
                <h2 className="mb-1 text-xm">
                  {post.content.length > 50 ? `${post.content.substring(0, 55)}...` : post.content}
                </h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Infinite Scroll Trigger */}
      <div className="gap-10 grid grid-cols-3 px-20 pt-5">
        {hasMore &&
          Array(3)
            .fill(0)
            .map((_, index) => <div ref={ref} key={index}>
              <SkeletonLoader /></div>
            )}
      </div>
    </div>
  );
}
