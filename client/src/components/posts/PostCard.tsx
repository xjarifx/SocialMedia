import { formatDateDisplay } from "../../utils/time";

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
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const displayDate = formatDateDisplay(post.createdAt);
  return (
    <article className="border-b border-orange-200 p-4 hover:bg-orange-50/30 transition-colors">
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-600 font-medium text-lg">
            {post.username[0].toUpperCase()}
          </span>
        </div>

        {/* Post Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-primary-600">@{post.username}</h3>
            <span className="text-primary-400 text-sm">·</span>
            <span className="text-primary-400 text-sm">{displayDate}</span>
          </div>

          {/* Content */}
          <p className="text-primary-600 mb-3 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center space-x-8 max-w-md">
            {/* Like */}
            <button
              onClick={onLike}
              className={`flex items-center space-x-2 p-2 rounded-full hover:bg-orange-50 transition-colors group ${
                post.isLiked
                  ? "text-primary-600"
                  : "text-primary-400 hover:text-primary-600"
              }`}
            >
              <div
                className={`p-2 rounded-full group-hover:bg-orange-100 transition-colors ${
                  post.isLiked ? "bg-orange-100" : ""
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={post.isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              {post.likes > 0 && <span className="text-sm">{post.likes}</span>}
            </button>

            {/* Comment */}
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-orange-50 text-primary-400 hover:text-primary-600 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-orange-100 transition-colors">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              {post.comments > 0 && (
                <span className="text-sm">{post.comments}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
