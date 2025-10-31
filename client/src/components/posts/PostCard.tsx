import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { formatDateDisplay } from "../../utils/time";
import { formatNumber } from "../../utils/format";
import { api } from "../../utils/api";
import { useToast } from "../ui/Toast";
import ConfirmDialog from "../ui/ConfirmDialog";
import EditPostModal from "./EditPostModal";
import CommentModal from "./CommentModal";
import Avatar from "../ui/Avatar";

interface Post {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  isReposted: boolean;
  media?: string[];
  views?: number;
  avatarUrl?: string;
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onClick?: () => void;
  onDelete?: (postId: number) => void;
  onUpdate?: (postId: number, newContent: string) => void;
  onCommentAdded?: () => void;
}

export default function PostCard({
  post,
  onLike,
  onClick,
  onDelete,
  onUpdate,
  onCommentAdded,
}: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const displayDate = formatDateDisplay(post.createdAt);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = user?.username === post.username;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLikeAnimating(true);
    onLike();
    setTimeout(() => setIsLikeAnimating(false), 600);
  };

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${post.username}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleUpdatePost = (postId: number, newContent: string) => {
    if (onUpdate) {
      onUpdate(postId, newContent);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.deletePost(post.id);
      setShowDeleteConfirm(false);
      showToast("Post deleted successfully", "success");
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCommentModal(true);
  };

  const handleCommentAdded = () => {
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  const renderMediaGrid = () => {
    if (!post.media || post.media.length === 0) return null;

    const mediaCount = post.media.length;

    if (mediaCount === 1) {
      return (
        <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-700">
          <img
            src={post.media[0]}
            alt="Post media"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      );
    }

    if (mediaCount === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-neutral-700">
          {post.media.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Post media ${i + 1}`}
              className="w-full h-[280px] object-cover"
            />
          ))}
        </div>
      );
    }

    if (mediaCount === 3) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-neutral-700">
          <img
            src={post.media[0]}
            alt="Post media 1"
            className="w-full row-span-2 h-full object-cover"
          />
          <img
            src={post.media[1]}
            alt="Post media 2"
            className="w-full h-[140px] object-cover"
          />
          <img
            src={post.media[2]}
            alt="Post media 3"
            className="w-full h-[140px] object-cover"
          />
        </div>
      );
    }

    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border border-neutral-700">
        {post.media.slice(0, 4).map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Post media ${i + 1}`}
            className="w-full h-[140px] object-cover"
          />
        ))}
      </div>
    );
  };

  return (
    <article
      onClick={onClick}
      className="border-b border-neutral-800 px-4 py-3 hover:bg-neutral-900/30 transition-colors cursor-pointer"
    >
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div
            onClick={handleUsernameClick}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Avatar src={post.avatarUrl} alt={post.username} size="md" />
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center space-x-1">
              <h3
                onClick={handleUsernameClick}
                className="font-bold text-white hover:underline cursor-pointer text-[15px]"
              >
                {post.username}
              </h3>
              <span className="text-neutral-500 text-[15px]">·</span>
              <span className="text-neutral-500 text-[15px]">
                {displayDate}
              </span>
            </div>
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuToggle}
                  className="p-1 rounded-full hover:bg-primary-500/10 transition-colors group"
                >
                  <svg
                    className="w-4 h-4 text-neutral-500 group-hover:text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-black border border-neutral-800 rounded-xl shadow-lg overflow-hidden z-10">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-3 text-left text-white hover:bg-neutral-900 transition-colors flex items-center space-x-3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit post</span>
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      className="w-full px-4 py-3 text-left text-red-500 hover:bg-neutral-900 transition-colors flex items-center space-x-3 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>{isDeleting ? "Deleting..." : "Delete post"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <p className="text-white text-[15px] mb-2 whitespace-pre-wrap leading-normal">
            {post.content}
          </p>

          {/* Media Grid */}
          {renderMediaGrid()}

          {/* Actions */}
          <div className="flex items-center gap-12 -ml-2 mt-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 group relative"
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <motion.svg
                  className={`w-[18px] h-[18px] transition-colors ${
                    post.isLiked
                      ? "text-pink-600 fill-pink-600"
                      : "text-neutral-500 group-hover:text-pink-600"
                  }`}
                  fill={post.isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={
                    isLikeAnimating ? { scale: [1, 1.3, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </motion.svg>
              </div>
              {post.likes > 0 && (
                <span
                  className={`text-xs transition-colors ${
                    post.isLiked
                      ? "text-pink-600"
                      : "text-neutral-500 group-hover:text-pink-600"
                  }`}
                >
                  {formatNumber(post.likes)}
                </span>
              )}
            </button>

            {/* Comment */}
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 group"
            >
              <div className="p-2 rounded-full group-hover:bg-primary-500/10 transition-colors">
                <svg
                  className="w-[18px] h-[18px] text-neutral-500 group-hover:text-primary-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              {post.comments > 0 && (
                <span className="text-xs text-neutral-500 group-hover:text-primary-500 transition-colors">
                  {formatNumber(post.comments)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={{
          id: post.id,
          content: post.content,
          mediaUrl: post.media?.[0],
        }}
        onUpdate={handleUpdatePost}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
      />

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={post.id}
        postAuthor={post.username}
        postContent={post.content}
        onCommentAdded={handleCommentAdded}
      />
    </article>
  );
}
