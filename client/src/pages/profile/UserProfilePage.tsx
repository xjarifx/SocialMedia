import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import PostCard from "../../components/posts/PostCard";
import { PostSkeleton } from "../../components/ui/Skeleton";
import { formatNumber } from "../../utils/format";
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
  media?: string[];
  views?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      setIsLoading(true);
      setError(null);
      try {
        // Fetch posts and user data
        const data = await api.getPostsByUsername(username);

        // Set user data
        if (data.user) {
          setUser(data.user);
        }

        // Check follow status
        try {
          const followStatus = await api.checkFollowStatus(username);
          setIsFollowing(followStatus.isFollowing || false);
        } catch (err) {
          console.error("Error checking follow status:", err);
        }

        // Map posts
        type ApiPost = {
          id: number;
          caption?: string;
          createdAt?: string;
          created_at?: string;
          likeCount?: number;
          commentCount?: number;
        };
        const postsData = (data.posts as ApiPost[] | undefined) ?? [];
        const mapped: Post[] = postsData.map((p) => ({
          id: p.id,
          username: (p as any).username || username,
          content: p.caption ?? "",
          createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
          likes: p.likeCount ?? 0,
          comments: p.commentCount ?? 0,
          reposts: 0,
          isLiked: false,
          isReposted: false,
        }));
        setPosts(mapped);
      } catch (e: unknown) {
        const message =
          (e as { message?: string })?.message || "Failed to load profile";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [username]);

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

  const handleFollow = async () => {
    if (!username || isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await api.unfollowUser(username);
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
      } else {
        await api.followUser(username);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (error && !isLoading) {
    return (
      <div className="w-full">
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10 px-4 py-2">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Profile</h1>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10 px-4 py-2">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">{user?.username || username}</h1>
            <p className="text-xs text-neutral-500">
              {formatNumber(posts.length)} posts
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="w-full h-48 bg-neutral-800 animate-pulse"></div>
          <div className="px-4 pb-4">
            <div className="w-32 h-32 bg-neutral-800 rounded-full animate-pulse -mt-16 mb-4"></div>
            <div className="h-6 bg-neutral-800 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-neutral-800 rounded w-32 mb-4 animate-pulse"></div>
          </div>
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        <>
          {/* Profile Info */}
          <div className="px-4 py-4">
            {/* Avatar and Follow Button */}
            <div className="flex justify-between items-start mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center border-4 border-white"
              >
                <span className="text-white font-bold text-4xl">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </motion.div>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  className="font-bold"
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading
                    ? "..."
                    : isFollowing
                    ? "Following"
                    : "Follow"}
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-3">
              <h2 className="text-xl font-bold text-white">{user?.username}</h2>
              <p className="text-[15px] text-neutral-500">
                @{user?.username?.toLowerCase()}
              </p>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="mb-3">
                <p className="text-[15px] text-white">{user.bio}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-neutral-500 text-[15px]">
              {/* Join Date */}
              <div className="flex items-center space-x-1">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Joined{" "}
                  {user?.createdAt
                    ? formatDate(user.createdAt)
                    : "January 2024"}
                </span>
              </div>
            </div>

            {/* Following/Followers */}
            <div className="flex items-center space-x-5 mb-4">
              <button className="hover:underline">
                <span className="font-bold text-white">
                  {formatNumber(followingCount)}
                </span>{" "}
                <span className="text-neutral-500">Following</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold text-white">
                  {formatNumber(followerCount)}
                </span>{" "}
                <span className="text-neutral-500">Followers</span>
              </button>
            </div>
          </div>

          {/* Posts */}
          <div>
            {posts.length === 0 && (
              <div className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-neutral-500 mb-4">
                  This user hasn't posted anything yet.
                </p>
              </div>
            )}
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
