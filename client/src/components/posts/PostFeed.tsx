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
        const data =
          activeTab === "for-you"
            ? await api.getForYouPosts()
            : await api.getFollowingPosts();
        const mapped: Post[] = (data.posts || []).map((p: any) => ({
          id: p.id,
          username: p.userId?.toString() || "user", // placeholder until user join implemented
          content: p.caption || "",
          createdAt: p.createdAt,
          likes: p.likeCount ?? 0,
          comments: p.commentCount ?? 0,
          reposts: 0,
          isLiked: false,
          isReposted: false,
        }));
        setPosts(mapped);
      } catch (e: any) {
        setError(e.message || "Failed to load posts");
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

  if (isLoading) {
    return (
      <div className="p-8 text-center min-h-96 flex flex-col justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-2 text-primary-400">Loading posts...</p>
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
        <p className="text-primary-400">
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
        />
      ))}
    </div>
  );
}
