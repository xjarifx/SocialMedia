import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { api } from "../../utils/api";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    content: string;
  };
  onUpdate: (postId: number, newContent: string) => void;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  onUpdate,
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 280;
  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  // Reset content when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(post.content);
    }
  }, [isOpen, post.content]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit || content === post.content) return;

    setIsUpdating(true);
    try {
      await api.updatePost(post.id, { caption: content });
      onUpdate(post.id, content);
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
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

              {/* Character Count */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
                <div className="flex-1" />
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
                            ? "text-orange-500"
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
                          isOverLimit ? "text-red-500" : "text-orange-500"
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
