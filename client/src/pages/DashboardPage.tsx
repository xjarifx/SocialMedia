import { useState } from "react";
import PostFeed from "../components/posts/PostFeed";
import SearchBar from "../components/ui/SearchBar";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  return (
    <div className="flex w-full">
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

      {/* Right Search Panel */}
      <div className="w-80 p-6 bg-white border-l border-orange-200">
        <div className="sticky top-6">
          <SearchBar
            placeholder="Search posts, users, topics..."
            onSearch={handleSearch}
          />

          {/* Search Results/Suggestions */}
          <div className="mt-6 space-y-4">
            <div className="bg-orange-50 rounded-soft p-4">
              <h3 className="font-semibold text-primary-600 mb-3">
                Trending Now
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-primary-400">#WebDevelopment</div>
                <div className="text-sm text-primary-400">#ReactJS</div>
                <div className="text-sm text-primary-400">#TypeScript</div>
                <div className="text-sm text-primary-400">#AI</div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-soft p-4">
              <h3 className="font-semibold text-primary-600 mb-3">
                Recent Searches
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-primary-400">
                  social media design
                </div>
                <div className="text-sm text-primary-400">tailwind css</div>
                <div className="text-sm text-primary-400">typescript tips</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
