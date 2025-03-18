import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => {
  return (
    <div className="border border-gray-200 shadow-sm h-56 w-full rounded-md p-7 bg-gray-100">
      {/* Header: Date & Bookmark Icon */}
      <div className="flex justify-between p-2">
        <Skeleton width={80} height={16} />
        <Skeleton width={24} height={24} circle />
      </div>

      {/* Post Content */}
      <div className="p-2 space-y-2">
        <Skeleton height={20} width="70%" />
        <Skeleton height={20} width="100%" />
        <Skeleton height={20} width="85%" />
      </div>

      {/* See Full Post Link */}
      <Skeleton height={14} width={120} />
    </div>
  );
};
