import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";
export default function SearchResult() {
    const [loading, setLoading] = useState(false);
    const [posts, setPost] = useState([]);
    const { searchstring } = useParams();
    const [error, setErrors] = useState("");
    const api = useAxios();

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

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/post-detail/?search=" + searchstring
                );
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setErrors("Failed to load posts.");
            }
            setLoading(false);
        };

        loadPosts();
    }, []);

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
        <div className="flex ">
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Header />
                <div className="p-2">
                    <div>
                        <h1 className="text-xl font-bold text-orange-500 mb-5">Search results for "{searchstring}"</h1>
                        {posts.length === 0 && (
                            <div className="flex justify-center items-center h-40">
                                <p className="text-lg">No results found</p>
                            </div>
                        )}
                        <div className="flex flex-col space-y-5 mt-4">
                            {posts.map((post, index) => (
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
                                            {post.content}
                                        </h2>
                                    </div>
                                    <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                                        See full post →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}