import { useState, useEffect } from "react";
import PostCard from "./PostCard";

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

// TODO: Replace with actual API calls to fetch posts

export default function PostFeed({ activeTab }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual API calls to fetch posts
    const loadPosts = async () => {
      setIsLoading(true);

      // For now, set empty posts until API integration
      setPosts([]);
      setIsLoading(false);
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
