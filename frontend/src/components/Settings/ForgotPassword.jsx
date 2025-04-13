import { useState } from "react";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { XMarkIcon } from '@heroicons/react/24/outline'
import {Link} from "react-router-dom";

export default function ForgotPassword() {
    const api = useAxios();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        const response = await api
            .post("/password_reset/", formData)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log("Request sent successfully");
                    Swal.fire({
                        title: "Request sent Successfully",
                        icon: "success",
                        toast: true,
                        timer: 3000,
                        position: "bottom-right",
                        timerProgressBar: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                    });
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
    return (
        <div className="flex items-center h-screen bg-slate-100">
            <div className="w-2/3 max-w-md mx-auto bg-slate-100 p-8 rounded-lg shadow-md">
            <div className="float-right"><Link to ="/" className=""><XMarkIcon className="h-6 w-6 text-gray-500" /></Link></div>
                <h1 className="text-3xl font-bold text-orange-500 mt-5">Tìm tài khoản của bạn</h1>
                <form onSubmit={submitHandler} className="mt-5">
                    <div className="flex flex-col">
                        <p className="font-medium text-slate-700 pb-1">Email</p>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            aria-invalid="false"
                            className=" border-slate-200 p-3 focus:outline-none focus:border-slate-200 hover:shadow rounded border-2"
                            autoComplete='email'
                            maxLength="100"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                        </div>
                    <button
                        id="submit-btn"
                        className="w-full p-2 mt-8 hover:bg-orange-300 rounded border text-xm bg-orange-500 text-white"
                        type="submit"
                    >
                        Yêu cầu đổi mật khẩu 
                    </button>
                </form>
            </div>
        </div>
    );
};
