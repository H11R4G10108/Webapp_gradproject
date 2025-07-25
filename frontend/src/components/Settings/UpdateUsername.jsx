import Navbar from "../Navbar/Navbar";
import Sidebar2 from "./Sidebar2";
import Header from "../Header/Header";
import useAxios from "../../utils/useAxios";
import { useState } from "react";
import Swal from "sweetalert2";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom";
export default function UpdateUsername() {
    const api = useAxios();
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        await api
            .put("/change-user-infor/", formData)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log("Changed successfully");
                    Swal.fire({
                        title: "Cập nhập thành công",
                        icon: "success",
                        toast: true,
                        timer: 3000,
                        position: "bottom-right",
                        timerProgressBar: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                    });
                    setTimeout(() => {
                        window.location.reload(); // Reloads the page after success
                    }, 1500);
                }
            })
            .catch((error) => {
                console.log(error);
                setErrors(error.response.data);
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
                    title: "Có lỗi xảy ra",
                    text: "Vui lòng thử lại",
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
    return (
          <>
      <Navbar />
        <div className="flex ">
            <Sidebar2 />
            <div className='flex flex-col'>
                <Header />
                <form onSubmit={submitHandler} className="flex  w-full p-5 items-center">
                    <div className="flex flex-col  w-full gap-5">
                        <Link to="/settings/account-information" className=" text-black mt-4 ">
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        </Link>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold">Tên người dùng</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" className="border border-gray-300 rounded-lg p-2 mt-1" />
                                                        {errors.username && errors.username.length > 0 && (
                            <div className="text-xs p-1 text-red-700">
                                {errors.username.map((msg, index) => (
                                    <p key={index}>{msg}</p>
                                ))}
                            </div>
                        )}
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold p-2 rounded-lg mt-4 w-40">Cập nhập</button>
                    </div>
                </form>
            </div>
        </div>
            </>
    );
}