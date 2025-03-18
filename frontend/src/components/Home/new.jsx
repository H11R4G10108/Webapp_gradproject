import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

export default function PostList() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setErrors] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const api = useAxios();

  const { ref, inView } = useInView({ threshold: 1 });

  // Fetch posts
  useEffect(() => {
    const loadPosts = async () => {
      if (!hasMore) return;
      setLoading(true);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/posts/?page=${currentPage}`
        );

        setPosts((prevPosts) => [...prevPosts, ...response.data.results]); // Append new posts
        setHasMore(!!response.data.next); // Check if there are more pages
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrors("Failed to load posts.");
      }

      setLoading(false);
    };

    loadPosts();
  }, [currentPage]);

  // Load more posts when `inView` is true
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

      if (response.status === 201) {
        setBookmarkedPosts((prev) => [...prev, postId]);
        Swal.fire({ title: "Bookmark added", icon: "success", toast: true, timer: 3000 });
      } else if (response.status === 204) {
        setBookmarkedPosts((prev) => prev.filter((id) => id !== postId));
        Swal.fire({ title: "Bookmark removed", icon: "success", toast: true, timer: 3000 });
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: "Please try again", icon: "error", toast: true, timer: 6000 });
    }
  };

  return (
    <div>
      <div className="gap-10 grid grid-cols-3 px-20 pt-5">
        {posts.map((post, index) => (
          <div
            className="border border-slate-200 shadow-sm h-56 rounded-md p-7 bg-slate-50"
            key={index}
          >
            <div className="flex p-2 justify-between">
              <p className="text-sm font-bold">{new Date(post.p_date).toLocaleDateString()}</p>
              <button onClick={() => toggleBookmark(post.postid)}>
                {bookmarkedPosts.includes(post.postid) ? (
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

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={ref} className="text-center my-4">
          <p className="text-gray-500">Loading more posts...</p>
        </div>
      )}
    </div>
  );
}
