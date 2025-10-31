import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { api } from "../../utils/api";

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
  avatarUrl?: string;
}

interface PostFeedProps {
  activeTab: "for-you" | "following";
}

export default function PostFeed({ activeTab }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        type ApiPost = {
          id: number;
          userId?: number | string;
          caption?: string;
          mediaUrl?: string;
          createdAt?: string;
          created_at?: string;
          likeCount?: number;
          commentCount?: number;
        };
        const data =
          activeTab === "for-you"
            ? await api.getForYouPosts()
            : await api.getFollowingPosts();
        const postsData = (data.posts as ApiPost[] | undefined) ?? [];
        const mapped: Post[] = postsData.map((p) => ({
          id: p.id,
          username: (p as any).username || "user",
          content: p.caption ?? "",
          createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
          likes: p.likeCount ?? 0,
          comments: p.commentCount ?? 0,
          reposts: 0,
          isLiked: false,
          isReposted: false,
          media: p.mediaUrl ? [p.mediaUrl] : undefined,
          avatarUrl: (p as any).avatarUrl,
        }));
        setPosts(mapped);
      } catch (e: unknown) {
        const message =
          (e as { message?: string })?.message || "Failed to load posts";
        setError(message);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [activeTab]);

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleDelete = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleUpdate = (postId: number, newContent: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, content: newContent } : post
      )
    );
  };

  const handleCommentAdded = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      )
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center min-h-96 flex flex-col justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-neutral-400">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center min-h-96 flex flex-col justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center min-h-96 flex flex-col justify-center">
        <p className="text-neutral-400">
          {activeTab === "following"
            ? "No posts from people you follow yet. Start following some users!"
            : "No posts to show right now. Be the first to post something!"}
        </p>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 ease-in-out">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCommentAdded={() => handleCommentAdded(post.id)}
        />
      ))}
    </div>
  );
}
