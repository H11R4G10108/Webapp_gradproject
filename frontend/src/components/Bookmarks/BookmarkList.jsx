import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useAxios from "../../utils/useAxios";
import { BookmarkSlashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function BookmarkList() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [error, setErrors] = useState("");
    const [sortOption, setSortOption] = useState("desc");
    const token = localStorage.getItem("authTokens");
    const api = useAxios();
    var user_id = 0;
    if (token) {
        const decode = jwtDecode(token);
        var user_id = decode.userid;
    }
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get(
                    `http://127.0.0.1:8000/api/bookmarks/?userid=${user_id}&page=${currentPage}&sort=${sortOption}`
                );
                setPosts(response.data.results || []);
                setTotalPages(response.data.total_pages);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setErrors("Failed to load posts.");
            }
            setLoading(false);
        };

        loadPosts();
    }, [user_id, currentPage, sortOption]);

    const toggleBookmark = async (postId) => {
        const response = await api
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
                    console.log("Error headers:", error.response.headers);
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

    return (
        <div>
            <div className="flex items-center px-20 pt-5">
                <span className="text-gray-500 mr-2">Sort by</span>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border px-3 py-1 rounded-md"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="gap-10 grid grid-cols-3 px-20 pt-5">
                {posts && posts.map((bookmark, index) => (
                    <div
                        className="border border-slate-200 shadow-sm h-56 rounded-md p-7 bg-slate-50"
                        key={index}
                    >
                        <div className="flex justify-between">
                            <p className="text-sm p-2 font-bold">{new Date(bookmark.post.p_date).toLocaleTimeString()}{" "}
                                {new Date(bookmark.post.p_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                            {/* Unbookmark Button */}
                            <button
                                onClick={() => toggleBookmark(bookmark.post.postid)}
                            >
                                <BookmarkSlashIcon className="h-5 w-5 mr-2  hover:text-orange-500" />
                            </button>
                        </div>
                        <div className="p-2 leading-5">
                            <h2 className="mb-1 text-xm">
                                {bookmark.post.content.length > 50 ? (
                                    <>
                                        {bookmark.post.content.substring(0, 55)}...
                                    </>
                                ) : (
                                    bookmark.post.content
                                )}
                            </h2>
                        </div>
                        <Link to={`/post/${bookmark.post.postid}`} className="text-blue-500 hover:underline ml-1">
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
