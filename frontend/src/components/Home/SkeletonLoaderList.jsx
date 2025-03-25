import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonLoaderList(){
  return (
    <div className="border border-gray-200 shadow-sm w-full rounded-md p-3 bg-gray-100">
          <div className="flex justify-between p-2">
            <Skeleton width={80} height={16} />
            <Skeleton width={24} height={24} circle />
          </div>
          <div className="p-2 space-y-2">
            <Skeleton height={20} width="70%" />
          </div>
          <Skeleton height={14} width={120} />
        </div>
  );
};
