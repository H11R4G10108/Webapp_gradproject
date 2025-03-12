import { jwtDecode } from "jwt-decode";
import { useLocation, matchPath } from "react-router-dom";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Header() {
  let location = useLocation();
  let navigate = useNavigate();
  
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path.includes("/reply-bot")) return "Reply bot";
    if (path.includes("/bookmarks")) return "Bookmarks";
    if (path.includes("/settings/account-information")) return "Account Information";
    if (path.includes("/settings/change-password")) return "Change Password";
    if (path.includes("/search-post")) return "Search Result";
    if (path.includes("/post/")) return "Post Detail";
    return "";
  };

  const title = getTitle();
  const [searchString, setSearchString] = useState("");

  const token = localStorage.getItem("authTokens");
  if (token) {
    jwtDecode(token);
  }

  const excludedPaths = ["/settings/change-password", "/reply-bot", "/settings/account-information"];
  const isExcluded = excludedPaths.includes(location.pathname) || matchPath("/post/:id", location.pathname);
  const isDetail = matchPath("/post/:id", location.pathname);

  const searchArticle = (e) => {
    e.preventDefault();
    if (searchString.trim() !== "") {
      navigate(`/search-post/${searchString}`);
    }
  };

  return (
    <div className="flex flex-row justify-between sticky top-0 bg-slate-100 p-3 border-b-2 h-16 align-center">
      {isDetail && (
        <Link to="/" className="text-black">
          <ArrowLeftIcon className="h-7 w-7 mr-2" />
        </Link>
      )}
      <p className="text-2xl font-bold">{title}</p>

      {/* SEARCH FUNCTION */}
      {!isExcluded ? (
        <form className="flex" id="search_form" onSubmit={searchArticle}>
          <input
            type="text"
            id="search"
            className="p-2 text-sm text-gray-900 rounded-l-md focus:outline-none"
            placeholder="Enter keywords ..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchArticle(e);
            }}
          />
          <button type="submit" className="px-4 py-2 rounded-r-md bg-white">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </button>
        </form>
      ) : (
        <form className="max-w-md mx-auto flex invisible" id="search_form">
          <input
            type="text"
            id="search"
            className="block w-full p-3 text-sm text-gray-900 border border-r-0"
            placeholder="Search by product title..."
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button type="button" className="border border-gray-300 px-4 py-2 border-l-0">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-900" />
          </button>
        </form>
      )}
    </div>
  );
}
