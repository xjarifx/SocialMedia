import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { formatDateDisplay } from "../../utils/time";
import { api } from "../../utils/api";
import Button from "../ui/Button";

interface Comment {
  id: number;
  userId: number;
  username: string;
  comment: string;
  createdAt: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  postAuthor: string;
  postContent: string;
  onCommentAdded?: () => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  postId,
  postAuthor,
  postContent,
  onCommentAdded,
}: CommentModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 280;
  const remainingChars = maxLength - comment.length;
  const isOverLimit = remainingChars < 0;

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen) {
      loadComments();
      setComment("");
    }
  }, [isOpen, postId]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getComments(postId);
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error loading comments:", error);
      showToast("Failed to load comments", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isOverLimit) return;

    setIsSubmitting(true);
    try {
      const response = await api.createComment(postId, comment);
      const newComment = response.comment; // Extract comment from response
      setComments((prev) => [newComment, ...prev]);
      setComment("");
      showToast("Comment added successfully", "success");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      showToast("Failed to post comment. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
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
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
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
            className="relative w-full max-w-2xl bg-black border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden mb-20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 sticky top-0 bg-black z-10">
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
                <h2 className="text-xl font-bold text-white">Comments</h2>
              </div>
            </div>

            {/* Original Post */}
            <div className="px-4 py-3 border-b border-neutral-800">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {postAuthor[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-[15px]">
                    {postAuthor}
                  </h3>
                  <p className="text-neutral-300 text-[15px] mt-1">
                    {postContent}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="px-4 py-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Post your reply"
                    className="w-full pt-2 pb-3 text-xl text-white placeholder-neutral-500 border-0 resize-none outline-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 bg-transparent min-h-[80px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
                    style={{ boxShadow: "none" }}
                    maxLength={maxLength + 50}
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
                    <div className="flex items-center">
                      {/* Character Count with Progress Circle */}
                      {comment.length > 0 && (
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
                                (1 - Math.min(comment.length / maxLength, 1))
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

                    {/* Reply Button */}
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={!comment.trim() || isOverLimit || isSubmitting}
                      className="bg-black hover:bg-neutral-900 text-white font-bold px-8 py-2.5 rounded-xl border border-neutral-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      {isSubmitting ? "Posting..." : "Reply"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-neutral-400 text-sm">
                    Loading comments...
                  </p>
                </div>
              ) : comments.length === 0 ? (
                <div className="p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-neutral-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="mt-2 text-neutral-400 text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                <div>
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="px-4 py-3 border-b border-neutral-800 hover:bg-neutral-900/30 transition-colors"
                    >
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {c.username?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <h3 className="font-bold text-white text-[15px]">
                              {c.username || "Unknown"}
                            </h3>
                            <span className="text-neutral-500 text-[15px]">
                              ·
                            </span>
                            <span className="text-neutral-500 text-[13px]">
                              {formatDateDisplay(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-neutral-300 text-[15px] mt-1 whitespace-pre-wrap">
                            {c.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
