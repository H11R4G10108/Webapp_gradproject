import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function PasswordReset() {
    const { token } = useParams()
    const api = useAxios();
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [ShowMessage, setShowMessage] = useState(false)
    const [password2, setPassword2] = useState("");
    const navigate = useNavigate();
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("password", password);
        formData.append("token", token);
        const response = await api
            .post("/password_reset/confirm/", formData)
            .then((response) => {
                setShowMessage(true)
                console.log(response);
                if (response.status === 200) {
                    console.log("Your password reset was successfull, you will be directed to the login page in a second");
                    Swal.fire({
                        title: "Your password reset was successfull, you will be directed to the login page in a second",
                        icon: "success",
                        toast: true,
                        timer: 2500,
                        position: "bottom-right",
                        timerProgressBar: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                    });
                    setTimeout(() => {
                        setAuthTokens(null);
                        setUser(null);
                        localStorage.removeItem("authTokens");
                        navigate("/login/");
                    }, 3000);
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
    return (<div className="flex items-center h-screen bg-slate-100">
        <div className="w-2/3 max-w-md mx-auto bg-slate-100 p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-orange-500 mt-5">Reset Password</h1>
            <form onSubmit={submitHandler} className="mt-5">
                <div className="flex flex-col">
                    <p className="font-medium text-slate-700 pb-1">Password</p>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your new password"
                        aria-invalid="false"
                        className=" border-slate-200 p-3 focus:outline-none focus:border-slate-200 hover:shadow rounded border-2"
                        maxLength="100"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <p className="text-red-500 text-sm mt-2">{errors.email}</p> */}
                </div>
                <div className="flex flex-col">
                    <p className="font-medium text-slate-700 pb-1">Confirm password</p>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        placeholder="Enter your new password again"
                        aria-invalid="false"
                        className=" border-slate-200 p-3 focus:outline-none focus:border-slate-200 hover:shadow rounded border-2"
                        maxLength="100"
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                {password !== password2 && password !== "" && password2 !== "" && (
                    <span className="text-xs p-1 text-red-700">
                        Passwords don't match!
                    </span>
                )}
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                <button
                    id="submit-btn"
                    className="w-full p-2 mt-8 hover:bg-orange-300 rounded border text-xm bg-orange-500 text-white"
                    type="submit"
                >
                    Reset Password
                </button>
            </form>
        </div>
    </div>
    )
}