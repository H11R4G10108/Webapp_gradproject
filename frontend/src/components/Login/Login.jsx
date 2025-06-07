import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedFields, setFocusedFields] = useState({
    email: false,
    password: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (e) => {
    const name = e.target.name;
    setFocusedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // Simple validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length > 0;
    if (isEmailValid && isPasswordValid) {
      loginUser(email, password);
    } else {
      setFocusedFields({
        email: true,
        password: true,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center mt-5">
        <div className="max-w-md mx-auto p-10 gap-20">
          <h1
            className="text-3xl font-bold text-orange-500 text-shadow-sm mb-5"
            id="typewriter"
          >
            Trọ Đà Nẵng xin chào!
          </h1>
          <form onSubmit={submitHandler}>
            <label>Email*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="email"
              type="email"
              placeholder="Nhập email"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleFocus}
              autoComplete="email"
              maxLength="100"
            />
            <span
              className={`text-xs p-1 text-red-700 ${
                focusedFields.email &&
                email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "block"
                  : "hidden"
              }`}
            >
              Địa chỉ email không hợp lệ!
            </span>
            <label>Mật khẩu*</label>
            <div className="relative">
              <input
                className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                required={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handleFocus}
                autoComplete="current-password"
                maxLength="128"
              />
              <button
                type="button"
                className="absolute right-2 top-3 text-gray-500 focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span
              className={`text-xs p-1 text-red-700 ${
                focusedFields.password && !password ? "block" : "hidden"
              }`}
            >
              Vui lòng nhập mật khẩu!
            </span>
            <a
              href="/forgot-password"
              className="font-medium text-orange-400 text-sm mt-5 hover:underline block"
            >
              Quên mật khẩu?
            </a>
            <a
              href="/register"
              className="font-medium text-orange-400 text-sm mt-2 hover:underline block"
            >
              Chưa có tài khoản?
            </a>
            <button
              id="submit-btn"
              className="w-full mt-5 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300"
              type="submit"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}