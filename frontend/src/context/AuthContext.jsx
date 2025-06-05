import { createContext, useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

// Use environment variable for API base URL
const BASE_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {
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

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      console.log("Logged In");
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      Swal.fire({
        title: "Đăng nhập thành công",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "bottom-right",
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
      });
    } else {
      console.log(response.status);
      console.log("There was a server issue");
      Swal.fire({
        title: "Email hoặc mật khẩu sai",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "bottom-right",
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
      });
    }
  };

  const registerUser = async (email, username, password1, password2) => {
    const response = await fetch(`${BASE_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password1,
        password2,
      }),
    });
    if (response.status === 201) {
      navigate("/login");
      Swal.fire({
        title: "Tạo tài khoản thành công",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showCloseButton: false,
        showConfirmButton: false,
      });
    } else {
      console.log(response.status);
      console.log("There was a server issue");
      Swal.fire({
        title: "An Error Occured " + response.status,
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showCloseButton: false,
        showConfirmButton: false,
      });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
    Swal.fire({
      title: "Đăng xuất thành công",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "bottom-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};