import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useToast } from "../ui/Toast";
import { api } from "../../utils/api";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    content: string;
    mediaUrl?: string;
  };
  onUpdate: (postId: number, newContent: string) => void;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  onUpdate,
}: EditPostModalProps) {
  const { showToast } = useToast();
  const [content, setContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>(post.mediaUrl || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxLength = 280;
  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  // Reset content when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(post.content);
      setMediaPreview(post.mediaUrl || "");
      setMediaFile(null);
    }
  }, [isOpen, post.content, post.mediaUrl]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const validVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const allValidTypes = [...validImageTypes, ...validVideoTypes];

    if (!allValidTypes.includes(file.type)) {
      showToast(
        "Please select a valid image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, MOV, AVI) file",
        "warning"
      );
      return;
    }

    const isVideo = validVideoTypes.includes(file.type);
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      showToast(
        isVideo
          ? "Video must be less than 50MB"
          : "Image must be less than 5MB",
        "warning"
      );
      return;
    }

    setMediaFile(file);

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
    if (!content.trim() || isOverLimit) return;
    if (content === post.content && !mediaFile) return;

    setIsUpdating(true);
    try {
      await api.updatePost(post.id, {
        caption: content,
        file: mediaFile || undefined,
      });
      onUpdate(post.id, content);
      showToast("Post updated successfully", "success");
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      showToast("Failed to update post. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-black border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
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
                <h2 className="text-xl font-bold text-white">Edit Post</h2>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={
                  !content.trim() || isOverLimit || content === post.content
                }
                isLoading={isUpdating}
                className="bg-black hover:bg-neutral-900 text-white font-bold px-6 py-2 rounded-xl border border-neutral-700 transition-all duration-200 disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="w-full pt-2 pb-3 text-xl text-white placeholder-neutral-500 border-0 resize-none outline-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 bg-transparent min-h-[120px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
                style={{ boxShadow: "none" }}
                maxLength={maxLength + 50}
              />

              {/* Media Preview */}
              {mediaPreview && (
                <div className="mt-4">
                  <div className="relative group rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-200">
                    {mediaFile && mediaFile.type.startsWith("video/") ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full h-64 object-cover bg-black"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Post media"
                        className="w-full h-64 object-cover"
                      />
                    )}
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
              )}

              {/* Character Count and Media Upload */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
                <div className="flex items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
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
                      New{" "}
                      {mediaFile.type.startsWith("video/") ? "video" : "image"}{" "}
                      selected
                    </span>
                  )}
                </div>
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
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
