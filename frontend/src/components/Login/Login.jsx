import { useContext, useEffect } from "react";
// import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";

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
      <div className="flex justify-center items-center h-screen bg-slate-100">
      <div className="w-2/3 max-w-md mx-auto bg-slate-100 p-8 rounded-lg shadow-md">
      
          <h1 className="text-4xl font-bold mb-5 text-orange-500" id="typewriter">Welcome to FLICDex!</h1>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-medium text-slate-700 pb-2"
                  >Email</p>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    aria-invalid="false"
                    className="w-full py-3 border-slate-200 px-3 focus:outline-none focus:border-slate-200 hover:shadow rounded border-2"
                    autoComplete='email'
                    maxLength="100"
                  /></div>
                <div className="mt-5">
                  <p className="font-medium text-slate-700 pb-2"
                  >Password</p>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    aria-invalid="false"
                    className="w-full py-3 border-slate-200 px-3 focus:outline-none focus:border-slate-200 hover:shadow rounded border-2"
                    autoComplete='current-password'
                    maxLength="128"
                  />
                </div>
              </div>
              <a href="#" className="font-medium text-orange-400 text-sm mt-4 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              id="submit-btn"
              className="p-2 mt-5 w-full hover:bg-orange-300 rounded border text-xm bg-orange-500 text-white"
              type="submit"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>

  );
}
