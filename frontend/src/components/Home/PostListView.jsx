import { motion } from "framer-motion";
import { BookmarkOutline, BookmarkSolid } from "heroicons-react";
import { Link } from "react-router-dom";    
export function PostListView(isBookmarkView,viewMode, sortedPosts, bookmarkedPosts, toggleBookmark) {
  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  return (
  <>
      <div>
          <div className="pt-2 flex justify-between items-center px-20">
            <div className="py-3">
              <span className="text-gray-500 mr-2">Sort by</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border px-3 py-1 rounded-md"
              >
                <option value="latest">Latest articles</option>
                <option value="oldest">Oldest articles</option>
              </select>
            </div>
            <div className="flex ">
              <button className={`border-l-2 rounded-tl-md p-1.5 transition ${viewMode === "tiles" ? "bg-gray-200" : "bg-white"}`}
              onClick={() => setViewMode("tiles")}><Squares2X2Icon className="h-7 w-7" /></button>
              <button className={`border-2 rounded-tr-md p-1.5 transition ${viewMode === "list" ? "bg-gray-200" : "bg-white"}`} onClick={() => setViewMode("list")}><ListBulletIcon className="h-7 w-7" /></button>
            </div>
          </div>
        {/* List vỉew mode */}
        <div className="flex flex-col gap-5 px-20 pt-5">
          {viewMode === "list" && sortedPosts && sortedPosts.map((post, index) => (
            <motion.article
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
                <h2 className="mb-1 text-xm">
                  {post.content}
                </h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
              </motion.article>
          ))}
        </div>
        {/* Tiles view mode  */}
        <div className="gap-10 grid grid-cols-3 px-20 ">
          {viewMode === "tiles" && sortedPosts && sortedPosts.map((post, index) => (
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
                <h2 className="mb-1 text-xm">
                  {post.content.length > 50 ? `${post.content.substring(0, 55)}...` : post.content}
                </h2>
              </div>
              <Link to={`/post/${post.postid}`} className="text-blue-500 hover:underline ml-1">
                See full post →
              </Link>
              </motion.div>
          ))}
        </div>
      </div>
      {/* Infinite Scroll Trigger */}
      <div className="gap-10 grid grid-cols-3 px-20 pt-5">
        {hasMore && viewMode === "tiles" &&
          Array(3)
            .fill(0)
            .map((_, index) => <div ref={ref} key={index}>
              <SkeletonLoader /></div>
            )}
      </div>
      <div className="px-20">
        {hasMore && viewMode === "list" &&
          Array(1)
            .fill(0)
            .map((_, index) => <div ref={ref} key={index}>
              <SkeletonLoader /></div>
            )}
      </div>
    </>
  );
}