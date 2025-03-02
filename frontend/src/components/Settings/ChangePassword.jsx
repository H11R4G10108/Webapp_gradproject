import useAxios from "../../utils/useAxios";
import "./ChangePassword.css"
import Sidebar from "../Sidebar/Sidebar"
import Header from "../Header/Header"
import Sidebar2 from "./Sidebar2"
import Swal from "sweetalert2";
import { useState } from "react";

export default function ChangePassword() {
    const api = useAxios();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [oldpassword, setOldPassword] = useState("");
    const [focused, setFocused] = useState(false);
    const handleFocus = (e) => {
        setFocused(true);
    };
    const [errors, setErrors] = useState("");
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("old_password", oldpassword);
        formData.append("new_password", password);
        const response = await api
            .put("/change-password/", formData)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log("Changed successfully");
                    Swal.fire({
                        title: "Changed Successfully",
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
        <div className="flex ">
            <Sidebar />
            <Sidebar2 />
            <div className='flex flex-col w-full'>
                <Header />
                <div className="flex justify-center items-center bg-slate-100">
                </div>
                <form onSubmit={submitHandler} className="flex p-5 items-center w-full bg-slate-100">
                    <div className="flex flex-col w-full gap-5">
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold">Current Password</label>
                            <input type="password" className="border border-gray-300 rounded-lg p-2 mt-1"
                                onChange={(e) => setOldPassword(e.target.value)}
                                maxLength="128"
                                onBlur={handleFocus}
                                focused={focused.toString()}
                                placeholder="Enter your current password"
                            />
                            {errors.old_password && errors.old_password.length > 0 && (
                                <div className="text-xs text-red-700 mt-3">
                                    {errors.old_password.map((msg, index) => (
                                        <p key={index}>{msg}</p>
                                    ))}
                                </div>
                            )}
                            <a href="/forgot-password" className="font-medium text-orange-400 text-sm mt-4 hover:underline">
                                Forgot Password?
                            </a>


                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold">New Password</label>
                            <input
                                name="password"
                                type="password" className="border border-gray-300 rounded-lg p-2 mt-1"
                                placeholder="At least 8 characters"
                                maxLength="128"
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={handleFocus}
                                focused={focused.toString()} />
                            <span className="text-xs p-1 text-red-700 hidden">
                                Password should be 8-20 characters and include at least 1
                                letter, 1 number and 1 special character!
                            </span>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold">Confirm Password</label>
                            <input
                                maxLength="128"
                                name="password2"
                                type="password"
                                placeholder="At least 8 characters"
                                required="True"
                                onChange={(e) => setPassword2(e.target.value)}
                                onBlur={handleFocus}
                                focused={focused.toString()}
                                className="border border-gray-300 rounded-lg p-2 mt-1 w-full" />
                            {password !== password2 && password !== "" && password2 !== "" && (
                                <span className="text-xs p-1 text-red-700">
                                    Passwords don't match!
                                </span>
                            )}
                        </div>
                        <div>
                            {errors.new_password && errors.new_password.length > 0 && (
                                <div className="text-xs p-1 text-red-700">
                                    {errors.new_password.map((msg, index) => (
                                        <p key={index}>{msg}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold p-2 rounded-lg mt-4 w-52">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}