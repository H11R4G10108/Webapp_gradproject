import Sidebar from "../Sidebar/Sidebar";
import Sidebar2 from "./Sidebar2";
import Header from "../Header/Header";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
const BASE_URL = import.meta.env.VITE_API_URL
import Navbar from "../Navbar/Navbar";

export default function SettingPage() {
    const { user } = useContext(AuthContext);
    const user_id = user ? user.user_id : null;
    const [users, setUser] = useState({ username: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState("");
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}/users/${user_id}`
            );
            setUser(response.data);
            setLoading(false);
            setErrors(response.error);
        };
        fetchUser();
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
        <>
        <Navbar />
        <div className="flex ">
            <Sidebar2 />
            <div className='flex flex-col'>
                <Header />
                <div className="flex justify-center items-center">
                </div>
                <div className="flex  w-full p-5 items-center">
                    <div className="flex flex-col  w-full gap-5">
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold">Username</label>
                            <p
                                className="border border-gray-300 rounded-lg p-2 mt-1">{users.username}</p>
                            <a href="/settings/account-information/change-username" className="font-medium text-orange-400 text-sm mt-4 hover:underline">
                                Đổi tên người dùng →
                            </a>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold">Email</label>
                            <p
                                className="border border-gray-300 rounded-lg p-2 mt-1">{users.email}</p>
                            <a href="/settings/account-information/change-email" className="font-medium text-orange-400 text-sm mt-4 hover:underline">
                                Đổi Email →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div></>
    );
}