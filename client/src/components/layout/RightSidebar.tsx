import SearchBar from "../ui/SearchBar";
import { useCallback } from "react";

export default function RightSidebar() {
  const handleSearch = useCallback((query: string) => {
    // TODO: Implement global search logic (posts/users) via API
    console.log("Global search:", query);
  }, []);

  const trendingTopics = [
    { topic: "Technology", posts: "125K" },
    { topic: "Programming", posts: "89K" },
    { topic: "Design", posts: "67K" },
    { topic: "AI", posts: "234K" },
  ];

  const suggestedUsers = [
    {
      username: "techguru",
      name: "Tech Guru",
      bio: "Software engineer & tech enthusiast",
    },
    { username: "designpro", name: "Design Pro", bio: "UI/UX designer" },
  ];

  return (
    <div className="h-full overflow-y-auto py-2">
      {/* Search Bar - Twitter/X Style */}
      <div className="mb-4">
        <SearchBar placeholder="Search" onSearch={handleSearch} />
      </div>

      {/* What's happening - Twitter/X Style */}
      <div className="bg-neutral-900 rounded-2xl overflow-hidden mb-4">
        <h2 className="text-xl font-bold text-white px-4 py-3">
          What's happening
        </h2>
        <div>
          {trendingTopics.map((trend, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 hover:bg-neutral-800 transition-colors text-left"
            >
              <div className="text-xs text-neutral-500 mb-0.5">Trending</div>
              <div className="font-bold text-white text-[15px]">
                #{trend.topic}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {trend.posts} posts
              </div>
            </button>
          ))}
        </div>
        <button className="w-full px-4 py-3 text-primary-500 hover:bg-neutral-800 transition-colors text-left text-[15px]">
          Show more
        </button>
      </div>

      {/* Who to follow - Twitter/X Style */}
      <div className="bg-neutral-900 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-bold text-white px-4 py-3">
          Who to follow
        </h2>
        <div>
          {suggestedUsers.map((user, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-neutral-800 transition-colors flex items-start space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-[15px] hover:underline cursor-pointer">
                      {user.name}
                    </p>
                    <p className="text-neutral-500 text-[15px]">
                      @{user.username}
                    </p>
                  </div>
                  <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                    Follow
                  </button>
                </div>
                <p className="text-white text-[15px] mt-1">{user.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full px-4 py-3 text-primary-500 hover:bg-neutral-800 transition-colors text-left text-[15px]">
          Show more
        </button>
      </div>
    </div>
  );
}
