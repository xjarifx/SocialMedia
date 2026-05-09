import type { Post } from "@/services/api";
import { API_ROOT_URL } from "@/services/api";
import type { PostProps } from "@/components";

/**
 * Formats an ISO date string into a human-readable relative time.
 */
function formatPostTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${Math.max(diffHours, 1)}h`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Transforms an API Post object into PostProps for the PostCard component.
 */
export function transformPost(post: Post, currentUserId?: string): PostProps {
  const imageUrl = post.imageUrl
    ? post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `${API_ROOT_URL}${post.imageUrl}`
    : undefined;

  return {
    id: post.id,
    authorId: post.author?.id,
    author: {
      name:
        post.author?.firstName && post.author?.lastName
          ? `${post.author.firstName} ${post.author.lastName}`
          : post.author?.username || "Unknown",
      handle: post.author?.username || "user",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.id || post.author?.username || post.id}`,
    },
    authorPlan: post.author?.plan,
    content: post.content,
    image: imageUrl,
    visibility: post.visibility,
    timestamp: formatPostTime(post.createdAt),
    likes: post.likesCount,
    replies: post.commentsCount,
    liked: currentUserId ? post.likes?.includes(currentUserId) : false,
  };
}
