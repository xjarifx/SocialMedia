import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { api } from "../../utils/api";
import Button from "../ui/Button";

export default function PostComposer() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxLength = 280;
  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaFiles.length > 4) {
      showToast("You can only upload up to 4 images", "warning");
      return;
    }

    const newFiles = files.slice(0, 4 - mediaFiles.length);
    setMediaFiles([...mediaFiles, ...newFiles]);

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit) return;

    setIsPosting(true);
    try {
      await api.createPost({ caption: content });
      setContent("");
      setMediaFiles([]);
      setMediaPreviews([]);
      showToast("Post created successfully!", "success");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Failed to create post", "error");
    } finally {
      setIsPosting(false);
    }
  };

  const renderMediaPreviews = () => {
    if (mediaPreviews.length === 0) return null;

    return (
      <div
        className={`mt-3 grid gap-2 ${
          mediaPreviews.length === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {mediaPreviews.map((preview, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden"
          >
            <img
              src={preview}
              alt={`Upload ${index + 1}`}
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => removeMedia(index)}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 rounded-full p-1.5 transition-colors"
              type="button"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

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
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full pt-3 pb-2 text-xl text-white placeholder-neutral-500 border-0 resize-none focus:outline-none focus:ring-0 bg-transparent min-h-[60px] max-h-[400px] overflow-y-auto"
              maxLength={maxLength + 50} // Allow slight overflow for better UX
            />

            {/* Media Previews */}
            {renderMediaPreviews()}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 mt-2">
              <div className="flex items-center -ml-2">
                {/* Media Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mediaFiles.length >= 4}
                  className="p-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>

              <div className="flex items-center space-x-3">
                {/* Character Count with Progress Circle */}
                {content.length > 0 && (
                  <div className="relative flex items-center justify-center">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-neutral-700"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className={`${
                          isOverLimit
                            ? "text-red-500"
                            : remainingChars < 20
                            ? "text-orange-500"
                            : "text-primary-500"
                        }`}
                        strokeDasharray={`${2 * Math.PI * 12}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          12 *
                          (1 - Math.min(content.length / maxLength, 1))
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {remainingChars < 20 && (
                      <span
                        className={`absolute text-xs font-bold ${
                          isOverLimit ? "text-red-500" : "text-orange-500"
                        }`}
                      >
                        {remainingChars}
                      </span>
                    )}
                  </div>
                )}

                {/* Post Button */}
                <Button
                  type="submit"
                  isLoading={isPosting}
                  disabled={!content.trim() || isOverLimit}
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
