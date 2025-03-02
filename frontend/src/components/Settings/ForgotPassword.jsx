import { useState } from "react";
import axios from "axios";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/password-reset/", { email });
            setMessage("Password reset link sent! Check your email.");
        } catch (error) {
            setMessage("Error sending password reset email. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-slate-100">
        <div className="max-w-lg w-4/6 mx-auto">
          <h1 className="text-4xl font-bold text-orange-500">Find your account</h1>
          <p className="text-sm text-gray-500 mt-2">Enter the email associated with your account to change your password.
          </p> 
          <form onSubmit={handleSubmit} className="mt-5">
                <div>
                  <p className="font-medium text-slate-700 pb-2">Email</p>
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
            <button
              id="submit-btn"
              className="px-4 py-2 mt-5 hover:bg-orange-300 rounded border text-xm bg-orange-500 text-white"
              type="submit"
            >
              Next 
            </button>
          </form>
        </div>
      </div>
    );
};
