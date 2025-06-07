import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    const response = await axios
      .post(`${BASE_URL}/password_reset/`, formData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log("Request sent successfully");
          Swal.fire({
            title: "Yêu cầu thành công",
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
        setErrors(error.response);
        if (error.response) {
          console.log("Error response:", error.response);
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
    <div className="flex items-center h-screen">
      <div className="w-2/3 max-w-md mx-auto p-8">
        <div className="float-right">
          <Link to="/" className="">
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-orange-500 text-shadow-sm">
          Tìm tài khoản của bạn
        </h1>
        <form onSubmit={submitHandler} className="mt-5">
          <div className="flex flex-col">
            <p className="font-medium text-slate-700 pb-1">Email</p>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              aria-invalid="false"
              className=" border-slate-200 p-3 focus:outline-none focus:border-slate-200 hover:shadow rounded border-2"
              autoComplete="email"
              maxLength="100"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          </div>
          <button
            id="submit-btn"
            className="w-full mt-5 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300"
            type="submit"
          >
            Yêu cầu đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}
