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
    <article className="border-b border-neutral-800 px-4 py-3 hover:bg-neutral-900/30 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {post.username[0].toUpperCase()}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-1 mb-0.5">
            <h3 className="font-bold text-white hover:underline cursor-pointer text-[15px]">
              {post.username}
            </h3>
            <span className="text-neutral-500 text-[15px]">
              @{post.username.toLowerCase()}
            </span>
            <span className="text-neutral-500 text-[15px]">·</span>
            <span className="text-neutral-500 text-[15px]">{displayDate}</span>
          </div>

          {/* Content */}
          <p className="text-white text-[15px] mb-3 whitespace-pre-wrap leading-normal">
            {post.content}
          </p>

          {/* Actions - Twitter/X Style */}
          <div className="flex items-center justify-between max-w-md -ml-2">
            {/* Comment */}
            <button className="flex items-center space-x-1 group">
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
                  {post.comments}
                </span>
              )}
            </button>

            {/* Repost */}
            <button className="flex items-center space-x-1 group">
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <svg
                  className="w-[18px] h-[18px] text-neutral-500 group-hover:text-green-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              {post.reposts > 0 && (
                <span className="text-xs text-neutral-500 group-hover:text-green-500 transition-colors">
                  {post.reposts}
                </span>
              )}
            </button>

            {/* Like */}
            <button
              onClick={onLike}
              className="flex items-center space-x-1 group"
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <svg
                  className={`w-[18px] h-[18px] transition-colors ${
                    post.isLiked
                      ? "text-pink-600 fill-pink-600"
                      : "text-neutral-500 group-hover:text-pink-600"
                  }`}
                  fill={post.isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              {post.likes > 0 && (
                <span
                  className={`text-xs transition-colors ${
                    post.isLiked
                      ? "text-pink-600"
                      : "text-neutral-500 group-hover:text-pink-600"
                  }`}
                >
                  {post.likes}
                </span>
              )}
            </button>

            {/* Share */}
            <button className="flex items-center space-x-1 group">
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
