import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

export default function PasswordReset() {
  const { token } = useParams();
  const api = useAxios();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser, setAuthTokens } = useContext(AuthContext);

  // Password validation: 8-20 chars, at least 1 letter, 1 number, 1 special char
  const passwordValid =
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(
      password
    );
  const passwordsMatch = password === password2 && password.length > 0;
  const formValid = passwordValid && passwordsMatch;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    const formData = new FormData();
    formData.append("password", password);
    formData.append("token", token);
    await api
      .post("/password_reset/confirm/", formData)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title:
              "Đổi mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập.",
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
        setErrors(error.response?.data || {});
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
    <><Navbar />
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-500 mb-8 text-center">
          Đặt lại mật khẩu
        </h1>
        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700" htmlFor="password">
              Mật khẩu mới*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu mới"
                className="border-slate-200 p-3 focus:outline-none focus:border-orange-400 hover:shadow rounded border-2 transition w-full"
                maxLength={100}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && !passwordValid && (
              <span className="text-xs text-red-700">
                Mật khẩu có từ 8-20 kí tự, bao gồm ít nhất 1 chữ cái, 1 số và 1
                kí tự đặc biệt!
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700" htmlFor="password2">
              Xác nhận mật khẩu*
            </label>
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                id="password2"
                name="password2"
                placeholder="Nhập lại mật khẩu mới"
                className="border-slate-200 p-3 focus:outline-none focus:border-orange-400 hover:shadow rounded border-2 transition w-full"
                maxLength={100}
                autoComplete="new-password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword2((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && password2 && !passwordsMatch && (
              <span className="text-xs text-red-700">
                Mật khẩu không trùng!
              </span>
            )}
          </div>
          {errors?.password && (
            <span className="text-xs text-red-700">{errors.password}</span>
          )}
          <button
            id="submit-btn"
            className="w-full py-3 mt-2 text-white font-semibold rounded-md bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!formValid}
          >
            Cập nhật
          </button>
        </form>
      </div>
    </div></>
  );
}