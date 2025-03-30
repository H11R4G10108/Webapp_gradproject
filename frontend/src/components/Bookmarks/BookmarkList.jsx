import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { BookmarkSlashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useInView } from "react-intersection-observer";
import "react-loading-skeleton/dist/skeleton.css";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import "./BookmarkList.css";
export default function BookmarkList() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setErrors] = useState("");
    const [sortOption, setSortOption] = useState("latest");
    const api = useAxios();
    const { user } = useContext(AuthContext);
    const { ref, inView } = useInView({ threshold: 1 });
    const [viewMode, setViewMode] = useState("tiles");
    const user_id = user ? user.user_id : null;
    useEffect(() => {
        const loadPosts = async () => {
            if (!hasMore) return;
            setLoading(true);
            try {
                const response = await api.get(
                    `http://127.0.0.1:8000/api/bookmarks/?userid=${user_id}&page=${currentPage}`
                );
                const newPosts = response.data.results;
                setPosts((prevPosts) => {
                    const allPosts = [...prevPosts, ...newPosts];
                    // Remove duplicates using a Map
                    const uniquePosts = Array.from(new Map(allPosts.map(bookmark => [bookmark.post.postid, bookmark])).values());
                    console.log("Posts:", uniquePosts);
                    return uniquePosts;
                });
                setHasMore(!!response.data.next); // Check if there are more pages
            } catch (error) {
                console.error("Error fetching posts:", error);
                setErrors("Failed to load posts.");
            }
            setLoading(false);
        };

        loadPosts();
    }, [user_id, currentPage]);

    useEffect(() => {
        if (inView && hasMore) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [inView, hasMore]);

    const toggleBookmark = async (postId) => {
        await api
            .post(`http://127.0.0.1:8000/api/bookmark-toggle/${postId}/`)
            .then((response) => {
                console.log(response);
                if (response.status === 204) {
                    console.log("Bookmark removed successfully");
                    Swal.fire({
                        title: "Bookmark removed successfully",
                        icon: "success",
                        toast: true,
                        timer: 3000,
                        position: "bottom-right",
                        timerProgressBar: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                    });
                }
                setTimeout(() => {
                    window.location.reload(); // Reloads the page after success
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    console.log("Error response:", error.response);
                    console.log("Error data:", error.response.data);
                    console.log("Error status:", error.response.status);
                } else if (error.request) {
                    console.log("Error request:", error.request);
                } else {
                    console.log("Error message:", error.message);
                }
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
            });
    };

    if (error) return <p className="text-center mt-10">{error}</p>;

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOption === "latest") return new Date(b.post.p_date) - new Date(a.post.p_date);
        if (sortOption === "oldest") return new Date(a.post.p_date) - new Date(b.post.p_date);
        return 0;
    });
    const postVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };
    (function () {
        function onReady() {
            document.body.classList.remove('no-scroll');
        }

        if (document.readyState === 'complete') {
            setTimeout(onReady, 1000);
        } else {
            document.addEventListener('DOMContentLoaded', onReady);
        }
    })();
    return (
        <div id="no-scroll">
            <div className="pt-2 flex justify-between items-center px-20">
                <div className="py-3">
                    <span className="text-gray-500 mr-2">Sort by</span>
                    <select
                        onChange={(e => {
                            setSortOption(e.target.value);
                        })}
                        className="border px-3 py-1 rounded-md"
                        value={sortOption}
                    >
                        <option value="latest">Latest articles</option>
                        <option value="oldest">Oldest articles</option>
                    </select>
                </div>
                <div className="flex ">
                    <button className={`border-l-2 rounded-tl-md p-1.5 transition ${viewMode === "tiles" ? "bg-gray-200" : "bg-white"}`}
                        onClick={() => setViewMode("tiles")}><Squares2X2Icon className="h-7 w-7" /></button>
                    <button className={`border-2 rounded-tr-md p-1.5 transition ${viewMode === "list" ? "bg-gray-200" : "bg-white"}`} onClick={() => setViewMode("list")}><ListBulletIcon className="h-7 w-7" /></button>
                </div>
            </div>

            {/* List vỉew mode */}
            <div className="flex flex-col gap-5 px-20 pt-5">
                {viewMode === "list" && sortedPosts && sortedPosts.map((posts, index) => (
                    <motion.article
                        key={index}
                        variants={postVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-y border-slate-200 shadow-sm rounded-md p-1 w-full max-w-full"
                    >
                        <div className="flex p-2 justify-between">
                            <p className="text-xs font-bold">
                                {new Date(posts.post.p_date).toLocaleTimeString()}{" "}
                                {new Date(posts.post.p_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                            <button onClick={() => toggleBookmark(posts.post.postid)}>
                                <BookmarkSlashIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-2 flex flex-row justify-between">
                            <h2 className="mb-1 text-xm">
                                {posts.post.content}
                            </h2>
                            <Link to={`/post/${posts.post.postid}`} className="text-blue-500 hover:underline">
                                See full post →
                            </Link>
                        </div>
                    </motion.article>
                ))}
            </div>
            {/* Tiles view mode  */}
            <div className="gap-10 grid grid-cols-3 px-20 ">
                {viewMode === "tiles" && sortedPosts && sortedPosts.map((posts, index) => (
                    <motion.div
                        key={index}
                        variants={postVariants}
                        initial="hidden"
                        animate="visible"
                        className="border border-slate-200 shadow-sm rounded-md p-3 bg-slate-50 w-full max-w-full"
                    >
                        <div className="flex p-2 justify-between">
                            <p className="text-sm font-bold">
                                {new Date(posts.post.p_date).toLocaleTimeString()}{" "}
                                {new Date(posts.post.p_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                            <button onClick={() => toggleBookmark(posts.post.postid)}>
                                <BookmarkSlashIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-2 leading-5">
                            <h2 className="mb-1 text-xm">
                                {posts.post.content.length > 50 ? `${posts.post.content.substring(0, 55)}...` : posts.post.content}
                            </h2>
                        </div>
                        <Link to={`/post/${posts.post.postid}`} className="text-blue-500 hover:underline ml-1">
                            See full post →
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {loading ? (
                <div>
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
                    </div>) : null}
        </div>
    );
}
