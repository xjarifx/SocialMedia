import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import PostCard from "../../components/posts/PostCard";
import { api } from "../../utils/api";

// TODO: Replace with actual API calls to fetch user posts

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

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "posts" | "replies" | "media" | "likes"
  >("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getMyPosts();
        // server returns { posts: [{ id, userId, caption, mediaUrl, createdAt, updatedAt }] }
        const mapped: Post[] = (data.posts || []).map((p: any) => ({
          id: p.id,
          username: user.username,
          content: p.caption || "",
          createdAt: p.createdAt || p.created_at || new Date().toISOString(),
          likes: p.likeCount ?? 0,
          comments: p.commentCount ?? 0,
          reposts: 0,
          isLiked: false,
          isReposted: false,
        }));
        setPosts(mapped);
      } catch (e: any) {
        setError(e.message || "Failed to load posts");
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
    <div className="flex w-full">
      {/* Main Profile Content */}
      <div className="flex-1 bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-orange-200 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center">
              <div>
                <h1 className="text-xl font-bold text-primary-600">
                  {user?.username}
                </h1>
                <p className="text-sm text-primary-400">{posts.length} posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-4 pb-4 pt-6">
          {/* Avatar and Edit Button Row */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <Button
              onClick={() => navigate("/profile/edit")}
              variant="secondary"
            >
              Edit profile
            </Button>
          </div>

          {/* User Info */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-primary-600">
              {user?.username}
            </h2>
          </div>

          <div className="mb-4">
            <p className="text-primary-600">{user?.bio || ""}</p>
          </div>

          {/* Join Date */}
          <div className="mb-4 flex items-center text-primary-400">
            <svg
              className="w-4 h-4 mr-2"
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

          {/* Following/Followers */}
          <div className="flex space-x-6 mb-6">
            <button className="hover:underline">
              <span className="font-bold text-primary-600">0</span>{" "}
              <span className="text-primary-400">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-primary-600">0</span>{" "}
              <span className="text-primary-400">Followers</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-orange-200">
            <nav className="flex space-x-8">
              {[
                { key: "posts", label: "Posts" },
                { key: "replies", label: "Replies" },
                { key: "media", label: "Media" },
                { key: "likes", label: "Likes" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-primary-400 hover:text-primary-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          {activeTab === "posts" && (
            <div>
              {isLoading && (
                <div className="p-8 text-center">
                  <p className="text-primary-400">Loading your posts...</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="p-8 text-center">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
              {!isLoading && !error && posts.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-primary-400">
                    You haven't posted anything yet.
                  </p>
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
          )}

          {activeTab !== "posts" && (
            <div className="p-8 text-center">
              <p className="text-primary-400">
                {activeTab === "replies" && "No replies yet"}
                {activeTab === "media" && "No media posts yet"}
                {activeTab === "likes" && "No liked posts yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
