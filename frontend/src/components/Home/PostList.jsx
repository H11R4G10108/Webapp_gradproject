import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const BASE_URL = import.meta.env.VITE_API_URL

export default function PostList() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setErrors] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [sortOption, setSortOption] = useState("latest");
  const api = useAxios();
  const { ref, inView } = useInView({ threshold: 1 });
  const user_id = user ? user.user_id : null;
  const [viewMode, setViewMode] = useState("tiles");

  const loadPosts = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
  
    try {
      const response = await axios.get(
        `${BASE_URL}/posts/?page=${currentPage}`
      );
  
      setPosts((prevPosts) => {
        const allPosts = [...prevPosts, ...response.data.results];
        return Array.from(new Map(allPosts.map((post) => [post.postid, post])).values());
      });
  
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrors("Failed to load posts.");
    }
  
    setLoading(false);
  }, [currentPage, hasMore]);

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
          (`${BASE_URL}/bookmark-for-check/?userid=${user_id}`)
        );
        const bookmarkData = response.data || [];
        const bookmarkedIds = new Set(
          bookmarkData
            .filter((item) => item.post) // Ensure item.post exists
            .map((item) => item.post.postid) // Extract postid
        );
        setBookmarkedPosts(bookmarkedIds);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

  useEffect(() => {
    if (user_id) {
      loadBookmarkedPosts();
    }}, []);

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
  const getSortedPosts = (posts, option) => {
    return [...posts].sort((a, b) => {
      if (option === "latest") return new Date(b.p_date) - new Date(a.p_date);
      if (option === "oldest") return new Date(a.p_date) - new Date(b.p_date);
      return 0;
    });
  };

  const sortedPosts = getSortedPosts(posts, sortOption);

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  return (
    <>
      <div>
          <section className="pt-2 flex flex-col md:px-20
          md:flex-row md:justify-between md:items-center
          lg:flex-row lg:justify-between lg:items-center
          xl:flex-row xl:justify-between xl:items-center">
            <div className="py-3">
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
            <div className="hidden
            md:flex lg:flex xl:flex">
              <button className={`border-l-2 rounded-tl-md p-1.5 transition ${viewMode === "tiles" ? "bg-gray-200" : "bg-white"}`}
              onClick={() => setViewMode("tiles")}><Squares2X2Icon className="h-7 w-7" /></button>
              <button className={`border-2 rounded-tr-md p-1.5 transition ${viewMode === "list" ? "bg-gray-200" : "bg-white"}`} onClick={() => setViewMode("list")}><ListBulletIcon className="h-7 w-7" /></button>
            </div>
          </section>
        {/* List vỉew mode */}
        <section className="flex flex-col gap-5 px-20 pt-5">
          {viewMode === "list" && sortedPosts && sortedPosts.map((post) => (
            <motion.article
            key={post.postid}
            variants={postVariants}
            initial="hidden"
            animate="visible"
            className="border-y border-slate-200 shadow-sm rounded-md p-1 w-full max-w-full"
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
              <div className="p-2 flex flex-row justify-between">
                <div>
                <h2 className="mb-1 text-xm">
                  {post.content}
                </h2>
                <p className="text-sm">Author: Albert Robert</p>
                <p className="text-sm">Group: Science Time on Facebook</p>
                </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
              </div>
              </motion.article>
          ))}
        </section>
        {/* Tiles view mode  */}
        <section className="gap-2 grid grid-cols-1 px-2
        md:grid-cols-2 md:px-20 md:gap-10
        lg:grid-cols-3
        xl:grid-cols-3
        ">
          {viewMode === "tiles" && sortedPosts && sortedPosts.map((post) => (
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
                <h2 className="mb-1 text-xm">
                  {post.content.length > 50 ? `${post.content.substring(0, 55)}...` : post.content}
                </h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
              </motion.div>
          ))}
        </section>
      </div>
      {/* Infinite Scroll Trigger */}
      <div className="gap-10 grid grid-cols-3 px-20 pt-5">
        {hasMore && viewMode === "tiles" &&
          Array(3)
            .fill(0)
            .map((_, index) => <div ref={ref} key={index}>
              <SkeletonLoader /></div>
            )}
      </div>
      <div className="px-20">
        {hasMore && viewMode === "list" &&
          Array(1)
            .fill(0)
            .map((_, index) => <div ref={ref} key={index}>
              <SkeletonLoader /></div>
            )}
      </div>
    </>
  );
}