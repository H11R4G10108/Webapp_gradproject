import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function SearchBar() {
    let navigate = useNavigate();
    const [searchString, setSearchString] = useState("");
    const searchArticle = (e) => {
        e.preventDefault();
        if (searchString.trim() !== "") {
        navigate(`/search-post/${searchString}`);
    }
  };
return (
    <div>
    <form className="flex" id="search_form" onSubmit={searchArticle}>
    <input
      type="text"
      id="search"
      className="p-2 text-base text-gray-900 rounded-l-md md:w-96 border-y-2 border-l-2 border-orange-500"
      placeholder="Tìm với nội dung bài viết..."
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") searchArticle(e);
      }}
    />
    <button
      type="submit"
      className="px-4 py-2 border-y-2 border-r-2 border-orange-500 bg-white rounded-r-md"
    >
      <MagnifyingGlassIcon className="h-6 w-6 text-orange-500" />
    </button>
  </form></div>
)
}