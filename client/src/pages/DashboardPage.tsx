import { useState } from "react";
import PostFeed from "../components/posts/PostFeed";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  return (
    <div className="w-full h-full">
      {/* Header with Tabs - Twitter/X Style */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`flex-1 hover:bg-neutral-900 transition-colors relative ${
              activeTab === "for-you" ? "" : ""
            }`}
          >
            <div className="flex items-center justify-center h-[53px]">
              <span
                className={`text-[15px] font-medium ${
                  activeTab === "for-you"
                    ? "font-bold text-white"
                    : "text-neutral-500"
                }`}
              >
                For you
              </span>
            </div>
            {activeTab === "for-you" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary-500 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 hover:bg-neutral-900 transition-colors relative ${
              activeTab === "following" ? "" : ""
            }`}
          >
            <div className="flex items-center justify-center h-[53px]">
              <span
                className={`text-[15px] font-medium ${
                  activeTab === "following"
                    ? "font-bold text-white"
                    : "text-neutral-500"
                }`}
              >
                Following
              </span>
            </div>
            {activeTab === "following" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary-500 rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Post Feed */}
      <div>
        <PostFeed activeTab={activeTab} />
      </div>
    </div>
  );
}
