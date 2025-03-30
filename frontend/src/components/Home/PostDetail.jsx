import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import { SparklesIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL
export default function PostDetail() {
    const [post, setPosts] = useState([]);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState("");
    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${BASE_URL}/post-detail/${id}/`
                );
                setPosts(response.data);
                setLoading(false);
            }
            catch (error) {
                console.error("Error fetching posts:", error);
                setErrors("Failed to load posts.");
            }
        };
        loadPost();
    }, [id]);
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
        <div className="flex bg-white ">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Header />
                <div className="flex space-x-5 p-5 bg-white">
                    <div className="w-1/3">
                        <div className="flex-col items-center">
                            <h1 className="text-2xl font-bold">Question</h1>
                            <p className="text-gray-700 text-lg leading-normal mt-5">
                                {post.content}
                            </p>
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="Post"
                                    loading="lazy"
                                    className="mt-3 w-full rounded-lg object-cover"
                                />
                            )}
                            <div className="flex justify-between mt-5">
                                <p className="text-xm text-gray-500">
                                    {new Date(post.p_date).toLocaleTimeString()} {new Date(post.p_date).toLocaleDateString()}
                                </p>
                                <Link to={post.posturl} className="text-blue-500 hover:underline">
                                    Link →
                                </Link>
                            </div>
                            </div>
                            </div>
                    <div className=" w-2/3 bg-gray-100 p-5 rounded-lg">
                    <div className="mb-5">
                        <button className="flex rounded-lg bg-gradient-to-r from-pink-400 to-blue-400 text-white px-4 py-2 hover:from-pink-500 hover:to-blue-500 transition-all duration-300">
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            Generate reply                            
                            </button>
                        <p className="text-gray-700 text-base leading-relaxed mt-3 bg-white p-5 border-2 border-gray-200 rounded-lg">
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Mauris elit massa, facilisis ac
                            pretium quis, cursus non sem. Curabitur
                            molestie tincidunt finibus. Suspendisse varius
                            odio sed leo tincidunt iaculis. In vitae sodales
                            leo. Donec justo libero, imperdiet eu dictum
                            ut, sollicitudin sed est. Fusce lacus nulla,
                            fermentum in euismod sed, blandit in magna.
                            Maecenas sit amet neque blandit, facilisis est
                            eu, efficitur dolor. Vivamus tempor ultricies
                            tincidunt. Morbi nec maximus est.
                        </p>
                    </div>
                    <button className="flex items-center bg-slate-100 border border-black px-4 py-2 rounded-lg mt-auto hover:bg-gray-200">
                        <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                        Copy
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
