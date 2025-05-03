import Navbar from "../../components/Navbar/Navbar";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { registerUser } = useContext(AuthContext);
  const [focusedFields, setFocusedFields] = useState({
    username: false,
    email: false,
    password1: false,
    password2: false
  });

  const handleFocus = (e) => {
    const name = e.target.name;
    setFocusedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const togglePassword1Visibility = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2(!showPassword2);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    // Check if all validations pass
    const isUsernameValid = username.match(/^[A-Za-z0-9]{3,16}$/);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPassword1Valid = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(password1);
    const isPassword2Valid = password1 === password2;
    
    if (isUsernameValid && isEmailValid && isPassword1Valid && isPassword2Valid) {
      registerUser(email, username, password1, password2);
    } else {
      // Set all fields as focused to show validation errors
      setFocusedFields({
        username: true,
        email: true,
        password1: true,
        password2: true
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
            Tạo tài khoản
          </h1>          
          <form onSubmit={submitHandler}>
            <label>Username*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="username"
              type="text"
              placeholder="Username"
              pattern="^[A-Za-z0-9]{3,16}$"
              required={true}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleFocus}
              maxLength="10"
            />
            <span className={`text-xs p-1 text-red-700 ${focusedFields.username && username && !username.match(/^[A-Za-z0-9]{3,16}$/) ? 'block' : 'hidden'}`}>
              Tên người dùng phải từ 3-16 ký tự và không bao gồm bất kỳ ký tự đặc biệt nào!
            </span>
            <label>Email*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="email"
              type="email"
              placeholder="Email"
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleFocus}
            />
            <span className={`text-xs p-1 text-red-700 ${focusedFields.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'block' : 'hidden'}`}>
              Địa chỉ email không hợp lệ!
            </span>
            <label>Mật khẩu*</label>
            <div className="relative">
              <input
                className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                name="password1"
                type={showPassword1 ? "text" : "password"}
                placeholder="Password"
                required={true}
                onChange={(e) => setPassword1(e.target.value)}
                onBlur={handleFocus}
              />
              <button 
                type="button"
                className="absolute right-2 top-3 text-gray-500 focus:outline-none" 
                onClick={togglePassword1Visibility}
              >
                {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className={`text-xs p-1 text-red-700 ${focusedFields.password1 && password1 && !/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(password1) ? 'block' : 'hidden'}`}>
              Mật khẩu có từ 8-20 kí tự, bao gồm ít nhất 1 chữ cái, 1 số và 1 kí tự
              đặc biệt!
            </span>
            <label>Xác nhận mật khẩu*</label>
            <div className="relative">
              <input
                className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                name="password2"
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirm Password"
                required={true}
                onChange={(e) => setPassword2(e.target.value)}
                onBlur={handleFocus}
              />
              <button 
                type="button"
                className="absolute right-2 top-3 text-gray-500 focus:outline-none" 
                onClick={togglePassword2Visibility}
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className={`text-xs p-1 text-red-700 ${focusedFields.password2 && password1 && password2 && password1 !== password2 ? 'block' : 'hidden'}`}>
              Mật khẩu không trùng!
            </span>
            <a
                href="/login"
                className="font-medium text-orange-400 text-sm mt-5 hover:underline"
              >
                Đã có tài khoản?
              </a>
            <button
              id="submit-btn"
              className="w-full mt-5 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300"
              type="submit"
            >
              Tạo tài khoản
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}