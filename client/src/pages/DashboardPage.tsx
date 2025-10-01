import { useState } from "react";
import PostFeed from "../components/posts/PostFeed";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  return (
    <div className="flex w-full h-full">
      {/* Main Content */}
      <div className="flex-1 border-r border-orange-200 bg-white">
        {/* Header with Tabs */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-orange-200 z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab("for-you")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "for-you"
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-primary-400 hover:text-primary-600"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === "following"
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-primary-400 hover:text-primary-600"
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Post Feed */}
        <div className="min-h-screen">
          <PostFeed activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
