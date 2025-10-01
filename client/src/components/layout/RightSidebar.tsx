import SearchBar from "../ui/SearchBar";
import { useCallback } from "react";

export default function RightSidebar() {
  const handleSearch = useCallback((query: string) => {
    // TODO: Implement global search logic (posts/users) via API
    console.log("Global search:", query);
  }, []);

  return (
    <div className="h-screen sticky top-0 w-[40rem] border-l border-orange-200 bg-white flex flex-col">
      <div className="p-6 pb-4 border-b border-orange-200 bg-white/80 backdrop-blur-md">
        <SearchBar
          placeholder="Search posts, users, topics..."
          onSearch={handleSearch}
        />
      </div>
      {/* Future: trending topics, suggested users, etc. */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-sm text-primary-400">
          Search tips: try usernames or keywords.
        </div>
      </div>
    </div>
  );
}
