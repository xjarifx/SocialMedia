import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function PostComposer() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      // TODO: Implement post creation API call
      console.log("Creating post:", content);
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  return (
    <div className="border-b border-neutral-800 px-4 py-3">
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0 pt-1">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </div>

        {/* Composer */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full pt-3 pb-2 text-xl text-white placeholder-neutral-500 border-0 resize-none focus:outline-none focus:ring-0 bg-transparent"
              rows={3}
              maxLength={maxLength}
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 mt-2">
              <div className="flex items-center -ml-2">
                {/* Media Upload Button */}
                <button
                  type="button"
                  className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors"
                  title="Media"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>

                {/* Emoji Button */}
                <button
                  type="button"
                  className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors"
                  title="Emoji"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                {/* GIF Button */}
                <button
                  type="button"
                  className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors"
                  title="GIF"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                </button>

                {/* Poll Button */}
                <button
                  type="button"
                  className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors"
                  title="Poll"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {/* Character Count */}
                {content.length > 0 && (
                  <span
                    className={`text-sm ${
                      remainingChars < 20
                        ? "text-orange-600"
                        : "text-neutral-400"
                    }`}
                  >
                    {remainingChars}
                  </span>
                )}

                {/* Post Button */}
                <Button
                  type="submit"
                  isLoading={isPosting}
                  disabled={!content.trim() || remainingChars < 0}
                  className="px-6 py-2"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
