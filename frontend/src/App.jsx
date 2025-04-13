import "./App.css";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import CrawlBot from "./components/CrawlBot/CrawlBot.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import SettingPage from "./components/Settings/SettingPage.jsx";
import ChangePassword from "./components/Settings/ChangePassword.jsx";
import UpdateUsername from "./components/Settings/UpdateUsername.jsx";
import UpdateEmail from "./components/Settings/UpdateEmail.jsx";
import ForgotPassword from "./components/Settings/ForgotPassword.jsx";
import PasswordReset from "./components/Settings/PasswordReset.jsx";
import PostDetail from "./components/Home/PostDetail.jsx";
import Bookmarks from "./components/Bookmarks/Bookmarks.jsx";
import SearchResult from "./components/SearchPage/SearchResult.jsx";
import NewFunc from "./components/Home/new.jsx";
import LandingPage from "./components/Home/LandingPage.jsx";
import CompareRoom from "./components/Compare/CompareRoom.jsx";
import Register from "./components/Register/Register.jsx";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/compare" element={<CompareRoom />} />
        <Route path="/article" element={<Home />} />
        <Route path="/article/:postId" element={<PostDetail />} />
        <Route path="/search-post/:searchstring" element={<SearchResult />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/bookmarks/"
          element={
            <PrivateRoute>
              <Bookmarks />
            </PrivateRoute>
          }
        />
        <Route
          path="/crawl-bot"
          element={
            <PrivateRoute>
              <CrawlBot />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/account-information"
          element={
            <PrivateRoute>
              <SettingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/account-information/change-username"
          element={
            <PrivateRoute>
              <UpdateUsername />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/account-information/change-email"
          element={
            <PrivateRoute>
              <UpdateEmail />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<NewFunc />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
