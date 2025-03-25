import { motion } from "framer-motion";
import { BookmarkOutline, BookmarkSolid } from "heroicons-react";
import { Link } from "react-router-dom";    
export function PostListView() {
    

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  return (
<div className="flex flex-col gap-5 px-20 pt-5 text-sm">
          {viewMode === "list" && sortedPosts.map((post, index) => (
            <motion.div
              key={index}
              variants={postVariants}
              initial="hidden"
              animate="visible"
              className="border border-slate-200 shadow-sm rounded-md p-3 bg-slate-50 w-full max-w-full"
            >
              <div className="flex p-2 justify-between">
                <p className="text-sm font-bold">
                  {new Date(post.p_date).toLocaleTimeString()}{" "}
                  {new Date(post.p_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <button onClick={() => toggleBookmark(post.postid)}>
                  {bookmarkedPosts?.has(post.postid) ? (
                    <BookmarkSolid className="h-5 w-5 text-orange-500" />
                  ) : (
                    <BookmarkOutline className="h-5 w-5 text-orange-500" />
                  )}
                </button>
              </div>
              <div className="p-2 leading-5">
                <h2 className="mb-1 text-xm">{post.content}</h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
            </motion.div>
          ))}
        </div>
  );
}