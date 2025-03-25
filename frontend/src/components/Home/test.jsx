import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SkeletonLoaderTiles from "./SkeletonLoaderTiles";
import SkeletonLoaderList from "./SkeletonLoaderList";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function PostList({
  isBookmarkView = false,
  apiEndpoint = "http://127.0.0.1:8000/api/posts/" }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [sortOption, setSortOption] = useState("latest");
  const api = useAxios();
  const { ref, inView } = useInView({ threshold: 1 });
  const user_id = user ? user.user_id : null;
  const [viewMode, setViewMode] = useState("tiles");

  // Reset component state when isBookmarkView or apiEndpoint changes
  useEffect(() => {
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    setError("");
  }, [isBookmarkView, apiEndpoint]);

  // Load user's bookmarked posts
  useEffect(() => {
    const loadBookmarkedPosts = async () => {
      if (!user_id) return;
      
      try {
        const response = await api.get(
          `http://127.0.0.1:8000/api/bookmark-for-check/?userid=${user_id}`
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

    loadBookmarkedPosts();
  }, [user_id, api]);

  // Load posts with pagination
  useEffect(() => {
    const loadPosts = async () => {
      if (!hasMore) return;
      setLoading(true);
      try {
        // Use the provided API endpoint with pagination
        const endpoint = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}page=${currentPage}`;
        const response = await api.get(endpoint);
        const newPosts = response.data.results;

        if (isBookmarkView) {
            const newRes = newPosts.map(item => item.post); // Filter out any null posts
            console.log(newRes);
            setPosts((prevPosts) => {
              const allPosts = [...prevPosts, ...newPosts];
              const uniquePosts = Array.from(new Map(allPosts.map(post => [post.postid, post])).values());
              return uniquePosts;
            });
            // Set hasMore based on pagination data
            setHasMore(!!response.data.next);
        } else {
            setPosts((prevPosts) => {
              const allPosts = [...prevPosts, ...newPosts];
              const uniquePosts = Array.from(new Map(allPosts.map(post => [post.postid, post])).values());
              return uniquePosts;
            });
            // Set hasMore based on pagination data
            setHasMore(!!response.data.next);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle 404 errors gracefully
        if (error.response && error.response.status === 404) {
          setHasMore(false);
        } else {
          setError(`Failed to load ${isBookmarkView ? "bookmarks" : "posts"}.`);
        }
      }
      setLoading(false);
    };

    loadPosts();
  }, [currentPage, apiEndpoint, isBookmarkView, api, hasMore]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

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

          // If we're in bookmark view, remove the post from the list
          if (isBookmarkView) {
            setPosts(prevPosts => prevPosts.filter(post => post.postid !== postId));
          }
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

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.p_date) - new Date(a.p_date);
    if (sortOption === "oldest") return new Date(a.p_date) - new Date(b.p_date);
    return 0;
  });

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div>
      <div>
        <div className="pt-2 flex justify-between items-center px-20">
          <div className="py-3">
            <span className="text-gray-500 mr-2">Sort by</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-1 rounded-md"
            >
              <option value="latest">Latest Articles</option>
              <option value="oldest">Oldest Articles</option>
            </select>
          </div>
          <div className="flex">
            <button
              className={`border-l-2 rounded-tl-md p-1.5 transition ${viewMode === "tiles" ? "bg-gray-200" : "bg-white"}`}
              onClick={() => setViewMode("tiles")}
            >
              <Squares2X2Icon className="h-7 w-7" />
            </button>
            <button
              className={`border-2 rounded-tr-md p-1.5 transition ${viewMode === "list" ? "bg-gray-200" : "bg-white"}`}
              onClick={() => setViewMode("list")}
            >
              <ListBulletIcon className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* Title for the current view */}
        <h1 className="text-2xl font-bold px-20 pt-3">
          {isBookmarkView ? "Your Bookmarks" : "Latest Posts"}
        </h1>

        {/* Empty state for bookmark view */}
        {isBookmarkView && posts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <BookmarkOutline className="h-16 w-16 text-gray-400" />
            <p className="text-xl text-gray-500 mt-4">No bookmarks yet</p>
            <p className="text-gray-400">Your saved posts will appear here</p>
          </div>
        )}

        {/* List View Mode */}
        <div className="flex flex-col gap-5 px-20 pt-5 text-sm">
          {viewMode === "list" && sortedPosts.map((post, index) => (
            <motion.div
              key={post.postid}
              variants={postVariants}
              initial="hidden"
              animate="visible"
              className="border border-slate-200 shadow-sm rounded-md p-3 bg-slate-50 w-full max-w-full"
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
                <h2 className="mb-1 text-xm">{post.content}</h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tiles View Mode */}
        <div className="gap-10 grid grid-cols-3 px-20">
          {viewMode === "tiles" && sortedPosts.map((post, index) => (
            <motion.div
              key={post.postid}
              variants={postVariants}
              initial="hidden"
              animate="visible"
              className="border border-slate-200 shadow-sm rounded-md p-7 bg-slate-50"
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
                <h2 className="mb-1 text-xm">{post.content.length > 50 ? `${post.content.substring(0, 55)}...` : post.content}</h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Trigger */}
      <div className="gap-10 grid grid-cols-3 px-20 pt-5">
        {hasMore && viewMode === "tiles" &&
          Array(9).fill(0).map((_, index) => <div ref={index === 0 ? ref : null} key={index}><SkeletonLoaderTiles /></div>)
        }
      </div>

      <div className="flex flex-col gap-5 px-20">
        {hasMore && viewMode === "list" &&
          Array(4).fill(0).map((_, index) => <div ref={index === 0 ? ref : null} key={index}><SkeletonLoaderList /></div>)
        }
      </div>
      
    </div>
  );
}