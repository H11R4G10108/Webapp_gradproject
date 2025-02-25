import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import "./Header.css"

export default function Header() {
    let location = useLocation();
    const getTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Home';
        if (path.includes('/reply-bot')) return 'Reply bot';
        if (path.includes('/bookmarks')) return 'Bookmarks';
        if (path.includes('/settings')) return 'Settings';
        return ''; 
      };
      const title = getTitle(); 
      const [searchString, setSearchString] = useState("");
      const token = localStorage.getItem("authTokens");
      if (token) {
        const decoded = jwtDecode(token);
      }
      const searchArticle = (e) => {
        e.preventDefault();
        window.location.href = "/search-articles/" + searchString;
      };
      const excludedPaths = ["/settings", "/reply-bot"];
    return (
        <div className="flex flex-row px-5 justify-between sticky top-0 bg-slate-100 p-3 border-b-2 h-16 align-center">
        <p className="text-2xl font-bold">{title}</p>
        {/* SEARCH FUNCTION */}

        {!excludedPaths.includes(location.pathname) ? (
          <form
            className="flex"
            id="search_form"
          >
            <input
              type="text"
              id="search"
              className="p-2 text-sm text-gray-900 rounded-l-md focus:outline-none"
              placeholder="Enter keywords ..."
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button
              onClick={searchArticle}
              type="button"
              className="end-2.5 bottom-2.5 px-4 py-2 rounded-r-md bg-white"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </button>
          </form>
        ) : (
          <form
            className="max-w-md mx-auto flex invisible"
            id="search_form"
          >
            <input
              type="text"
              id="search"
              className="block w-full p-3 text-sm text-gray-900 border border-r-0"
              placeholder="Search by product title..."
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button
              type="button"
              className="border border-gray-300 end-2.5 bottom-2.5 px-4 py-2 border-l-0"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-900" />
            </button>
          </form>
        )}
        </div>
    )
}