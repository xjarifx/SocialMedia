import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followerCount] = useState(0);
  const [followingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getMyPosts();
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
          username: (p as any).username || user.username,
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
          (e as { message?: string })?.message || "Failed to load posts";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
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
            <h1 className="text-xl font-bold">{user?.username}</h1>
            <p className="text-xs text-neutral-500">
              {formatNumber(posts.length)} posts
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-4">
        {/* Avatar and Edit Button */}
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
              onClick={() => {
                console.log("Edit profile button clicked");
                navigate("/profile/edit");
              }}
              variant="secondary"
              className="font-bold"
            >
              Edit profile
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
          {/* Location (if available) */}
          {/* <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Location</span>
          </div> */}

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
              {user?.createdAt ? formatDate(user.createdAt) : "January 2024"}
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
        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
        {error && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && posts.length === 0 && (
          <div className="p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">No posts yet</h3>
            <p className="text-neutral-500 mb-4">
              When you post, it'll show up here.
            </p>
            <Button
              onClick={() => navigate("/post")}
              className="bg-black hover:bg-neutral-900 text-white font-bold border border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Post now
            </Button>
          </div>
        )}
        {!isLoading &&
          !error &&
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
      </div>
    </div>
  );
}
