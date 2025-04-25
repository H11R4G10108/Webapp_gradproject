import React from "react";

export default function SkeletonLoader({ viewMode = "tiles" }) {
  if (viewMode === "list") {
    return (
      <div className="border border-gray-100 shadow-md rounded-xl p-5 bg-white animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-6 w-3/4 bg-gray-300 rounded mb-3"></div>
            <div className="space-y-3">
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="h-8 w-1/2 bg-gray-300 rounded mb-4"></div>
            <div className="h-10 w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Tiles view skeleton
  return (
    <div className="border border-gray-100 shadow-md rounded-xl overflow-hidden bg-white animate-pulse">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-3"></div>
        <div className="space-y-3 mb-4">
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-1/3 bg-gray-300 rounded mb-4"></div>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}