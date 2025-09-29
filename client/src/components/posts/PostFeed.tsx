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

// Mock data for now
const mockPosts: Post[] = [
  {
    id: 1,
    username: "techguru",
    content:
      "Just shipped a new feature! 🚀 The new dashboard is looking clean with that Anthropic orange theme. What do you think?",
    createdAt: "2h",
    likes: 24,
    comments: 5,
    reposts: 3,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 2,
    username: "designlover",
    content:
      "Typography matters more than you think. A good font choice can make or break your entire design. Here are my top 5 font pairings for modern web apps:",
    createdAt: "4h",
    likes: 89,
    comments: 12,
    reposts: 15,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 3,
    username: "devlife",
    content:
      "That feeling when your code works on the first try... 😅 Rare but magical!",
    createdAt: "6h",
    likes: 156,
    comments: 23,
    reposts: 8,
    isLiked: true,
    isReposted: true,
  },
  {
    id: 4,
    username: "startupfounder",
    content:
      "Building in public is scary but rewarding. Today marks 100 days since we launched our MVP. Here's what we learned...",
    createdAt: "8h",
    likes: 67,
    comments: 18,
    reposts: 25,
    isLiked: false,
    isReposted: false,
  },
];

export default function PostFeed({ activeTab }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadPosts = async () => {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (activeTab === "for-you") {
        setPosts(mockPosts);
      } else {
        // Filter for following feed (mock)
        setPosts(
          mockPosts.filter((post) =>
            ["techguru", "designlover"].includes(post.username)
          )
        );
      }
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
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p className="mt-2 text-primary-400">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-primary-400">
          {activeTab === "following"
            ? "No posts from people you follow yet. Start following some users!"
            : "No posts to show right now. Be the first to post something!"}
        </p>
      </div>
    );
  }

  return (
    <div>
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
