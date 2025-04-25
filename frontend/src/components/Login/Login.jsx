import { useContext, useEffect } from "react";
// import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const submitHandler = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    email.length > 0 && loginUser(email, password);
    console.log(email);
    console.log(password);
  };
  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center mt-20">
        <div className="w-2/3 max-w-md mx-auto p-8">
          <h1
            className="text-3xl font-bold text-orange-500 text-shadow-sm"
            id="typewriter"
          >
            Trọ Đà Nẵng xin chào!
          </h1>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-medium text-slate-700 pb-2 mt-5">Email</p>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập email"
                    aria-invalid="false"
                    className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                    autoComplete="email"
                    maxLength="100"
                  />
                </div>
                <div className="mt-5">
                  <p className="font-medium text-slate-700 pb-2">Mật khẩu</p>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    aria-invalid="false"
                    className="w-full py-3 border-b-2 border-slate-200 px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                    autoComplete="current-password"
                    maxLength="128"
                  />
                </div>
              </div>
              <a
                href="/forgot-password"
                className="font-medium text-orange-400 text-sm mt-4 hover:underline"
              >
                Quên mật khẩu?
              </a>
              <a
                href="/register"
                className="font-medium text-orange-400 text-sm mt-2 hover:underline"
              >
                Chưa có tài khoản?
              </a>
            </div>
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
    </>
  );
}
