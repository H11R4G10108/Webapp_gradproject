import Navbar from "../../components/Navbar/Navbar";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Register.css";
export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);
  const [focused, setFocused] = useState(false);
  const handleFocus = (e) => {
    setFocused(true);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    registerUser(email, username, password1, password2);
  };
  console.log(username);
  console.log(email);
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center mt-10">
        <div className="max-w-md mx-auto bg-white p-10 shadow shadow-slate-300 gap-15">
          <h1 className="text-4xl font-medium mb-5">Tạo tài khoản</h1>
          <form onSubmit={submitHandler}>
            <label>Username*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="username"
              type="text"
              placeholder="Username"
              pattern="^[A-Za-z0-9]{3,16}$"
              required="True"
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleFocus}
              focused={focused.toString()}
              maxLength="10"
            />
            <span className="text-xs p-1 text-red-700 hidden">
              Tên người dùng phải từ 3-16 ký tự và không bao gồm bất kỳ ký tự đặc biệt nào!
            </span>
            <label>Email*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="email"
              type="email"
              placeholder="Email"
              required="True"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleFocus}
              focused={focused.toString()}
            />
            <span className="text-xs p-1 text-red-700 hidden">
              Địa chỉ email không hợp lệ!
            </span>
            <label>Mật khẩu*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="password1"
              type="password"
              placeholder="Password"
              pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
              required="True"
              onChange={(e) => setPassword1(e.target.value)}
              onBlur={handleFocus}
              focused={focused.toString()}
            />
            <span className="text-xs p-1 text-red-700 hidden">
              Mật khẩu có từ 8-20 kí tự, bao gồm ít nhất 1 chữ cái, 1 số và 1 kí tự
              đặc biệt!
            </span>
            <label>Xác nhận mật khẩu*</label>
            <input
              className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              name="password2"
              type="password"
              placeholder="Confirm Password"
              required="True"
              onChange={(e) => setPassword2(e.target.value)}
              onBlur={handleFocus}
              focused={focused.toString()}
            />
            {password1 !== password2 && (
              <span className="text-xs p-1 text-red-700">
                Mật khẩu không trùng!
              </span>
            )}
            <button
              id="submit-btn"
              className="px-4 py-2 mt-8 w-full rounded-sm hover:bg-white hover:text-black border border-orange-500 text-xm bg-orange-500 text-white"
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
