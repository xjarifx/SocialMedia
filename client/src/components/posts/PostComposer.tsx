import { useState, useRef, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { api } from "../../utils/api";
import Button from "../ui/Button";

export default function PostComposer() {
  const { showToast } = useToast();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
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
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      showToast(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
        "warning"
      );
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showToast("Image must be less than 5MB", "warning");
      return;
    }

    setMediaFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !mediaFile) || isOverLimit) return;

    setIsPosting(true);
    try {
      await api.createPost({
        caption: content.trim() || undefined,
        file: mediaFile || undefined,
      });
      setContent("");
      setMediaFile(null);
      setMediaPreview("");
      showToast("Post created successfully!", "success");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Failed to create post", "error");
    } finally {
      setIsPosting(false);
    }
  };

  const renderMediaPreviews = () => {
    if (!mediaPreview) return null;

    return (
      <div className="mt-4">
        <div className="relative group rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-200">
          <img
            src={mediaPreview}
            alt="Upload preview"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={removeMedia}
            className="absolute top-2 right-2 bg-black/80 hover:bg-black rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
            type="button"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="border-b border-neutral-800 p-4">
      <div className="flex">
        {/* Composer */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              autoFocus
              className="w-full pt-2 pb-3 text-xl text-white placeholder-neutral-500 border-0 resize-none outline-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 bg-transparent min-h-[120px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
              style={{ boxShadow: "none" }}
              maxLength={maxLength + 50} // Allow slight overflow for better UX
            />

            {/* Media Previews */}
            {renderMediaPreviews()}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
              <div className="flex items-center">
                {/* Media Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMediaSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!!mediaFile}
                  className="p-2.5 text-primary-500 hover:bg-primary-500/10 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  title="Add media"
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                {mediaFile && (
                  <span className="ml-2 text-sm text-neutral-400">
                    1 image selected
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Character Count with Progress Circle */}
                {content.length > 0 && (
                  <div className="relative flex items-center justify-center">
                    <svg className="w-9 h-9 transform -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-neutral-800"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className={`transition-all duration-300 ${
                          isOverLimit
                            ? "text-red-500"
                            : remainingChars < 20
                            ? "text-blue-500"
                            : "text-primary-500"
                        }`}
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          14 *
                          (1 - Math.min(content.length / maxLength, 1))
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {remainingChars < 20 && (
                      <span
                        className={`absolute text-xs font-bold transition-colors ${
                          isOverLimit ? "text-red-500" : "text-blue-500"
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
                  disabled={(!content.trim() && !mediaFile) || isOverLimit}
                  className="bg-black hover:bg-neutral-900 text-white font-bold px-8 py-2.5 rounded-xl border border-neutral-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
