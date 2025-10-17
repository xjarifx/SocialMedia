import SearchBar from "../ui/SearchBar";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await api.searchUsers(query);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
    setSearchResults([]);
    setHasSearched(false);
    setSearchQuery(""); // Clear the search bar
  };

  return (
    <div className="h-full overflow-y-auto py-2">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <SearchBar
          placeholder="Search"
          onSearch={handleSearch}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Search Results Dropdown */}
        {hasSearched && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 overflow-hidden z-50">
            {isSearching && (
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  <p className="text-neutral-500 text-sm">Searching...</p>
                </div>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((user: any) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user.username)}
                    className="w-full px-4 py-3 hover:bg-neutral-800 transition-colors flex items-center space-x-3 text-left"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-[15px]">
                        {user.username}
                      </p>
                      {user.bio && (
                        <p className="text-neutral-500 text-sm truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isSearching && searchResults.length === 0 && (
              <div className="p-4">
                <p className="text-neutral-500 text-sm text-center">
                  No users found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
