import { jwtDecode } from "jwt-decode";
import { useLocation, matchPath } from "react-router-dom";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { motion } from "framer-motion";
export default function Header() {
  let location = useLocation();
  let navigate = useNavigate();

  const getTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path.includes("/scraper-bot")) return "Scraper bot";
    if (path.includes("/bookmarks")) return "Bookmarks";
    if (path.includes("/settings/account-information")) return "Account Information";
    if (path.includes("/settings/change-password")) return "Change Password";
    if (path.includes("/search-post")) return "Search Result";
    if (path.includes("/post/")) return "Post Detail";
    return "";
  };

  const title = getTitle();
  const [searchString, setSearchString] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const excludedPaths = ["/settings/change-password", "/scraper-bot", "/settings/account-information", "/settings/account-information/change-username", "/settings/account-information/change-email"];
  const isExcluded = excludedPaths.includes(location.pathname) || matchPath("/post/:id", location.pathname);
  const isDetail = matchPath("/post/:id", location.pathname);
  const toggleSearchbar = () => {
    setIsSearchActive(!isSearchActive);
  };
  const searchArticle = (e) => {
    e.preventDefault();
    if (searchString.trim() !== "") {
      navigate(`/search-post/${searchString}`);
    }
  };

  return (
    <header className="w-full flex flex-row justify-between sticky top-0 bg-slate-100 md:p-3 p-2 border-b-2 items-center h-15">
      <div className="flex flex-row items-center justify-around gap-5">
        {isDetail && (
          <Link to="/" className="text-black">
            <ArrowLeftIcon className="h-7 w-7 mr-2" />
          </Link>
        )}
        <p className="md:ml-5 text-lg md:text-2xl">{title}</p>
        <MagnifyingGlassIcon className="h-5 w-5 md:hidden" onClick={toggleSearchbar} />
      </div>
      {/* MOBILE SEARCH FUNCTION */}
      {isSearchActive && !isExcluded ? (
        <div>
          <motion.div
            initial={{ y: -300 }}
            animate={{ y: 0 }}
            exit={{ y: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 h-screen py-5 z-50">
            <div className="flex">
              <form className="md:hidden flex" id="search_form" onSubmit={searchArticle}>
                <input
                  type="text"
                  id="search"
                  className="p-2 text-base text-gray-900 rounded-l-md"
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
              <button onClick={toggleSearchbar}> <XMarkIcon className="w-7 h-7 text-white" />
              </button>
              </div>
          </motion.div>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleSearchbar}></div>
        </div>
      ) : null}
      {/* SEARCH FUNCTION */}
      {!isExcluded ? (
        <form className="md:flex hidden" id="search_form" onSubmit={searchArticle}>
          <input
            type="text"
            id="search"
            className="p-2 text-base text-gray-900 rounded-l-md"
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
      ) : null}
    </header>
  );
}
