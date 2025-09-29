import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import PostCard from "../../components/posts/PostCard";

// Mock user posts for now
const mockUserPosts = [
  {
    id: 1,
    username: "currentuser",
    content:
      "Just updated my profile! Love the new Twitter-style layout. Clean and functional! 🎉",
    createdAt: "2h",
    likes: 12,
    comments: 3,
    reposts: 1,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 2,
    username: "currentuser",
    content:
      "Working on some exciting new features for our social media app. The orange theme is really growing on me!",
    createdAt: "1d",
    likes: 28,
    comments: 7,
    reposts: 4,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 3,
    username: "currentuser",
    content:
      "Beautiful sunset today! Sometimes you need to step away from the code and appreciate nature. 🌅",
    createdAt: "3d",
    likes: 45,
    comments: 12,
    reposts: 8,
    isLiked: true,
    isReposted: true,
  },
  {
    id: 4,
    username: "currentuser",
    content:
      "Spent the weekend learning about React 19 features. The new concurrent features are mind-blowing! 🤯 Can't wait to implement them in production.",
    createdAt: "4d",
    likes: 67,
    comments: 15,
    reposts: 12,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 5,
    username: "currentuser",
    content:
      "Coffee shop coding session today ☕ There's something about the ambient noise that helps me focus. Currently debugging a tricky state management issue.",
    createdAt: "5d",
    likes: 34,
    comments: 8,
    reposts: 3,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 6,
    username: "currentuser",
    content:
      "Loving the minimalist design trend in 2025. Less is definitely more when it comes to user interfaces. Clean, focused, intentional design wins every time 🎨",
    createdAt: "6d",
    likes: 89,
    comments: 21,
    reposts: 16,
    isLiked: true,
    isReposted: true,
  },
  {
    id: 7,
    username: "currentuser",
    content:
      "Just deployed a major update to production. No bugs so far 🤞 The new authentication system is working flawlessly. Time to celebrate with some pizza! 🍕",
    createdAt: "1w",
    likes: 52,
    comments: 9,
    reposts: 5,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 8,
    username: "currentuser",
    content:
      "Attended an amazing tech conference this week. The future of web development is looking bright with all these new tools and frameworks emerging! 🚀",
    createdAt: "1w",
    likes: 78,
    comments: 18,
    reposts: 23,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 9,
    username: "currentuser",
    content:
      "Working on improving our app's accessibility. It's not just about compliance - it's about making sure everyone can use our product. Every user matters 💪",
    createdAt: "2w",
    likes: 145,
    comments: 32,
    reposts: 28,
    isLiked: false,
    isReposted: true,
  },
  {
    id: 10,
    username: "currentuser",
    content:
      "Pair programming session was incredibly productive today. Two heads are definitely better than one when solving complex problems. Shoutout to my coding partner! 👥",
    createdAt: "2w",
    likes: 41,
    comments: 6,
    reposts: 7,
    isLiked: true,
    isReposted: false,
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "posts" | "replies" | "media" | "likes"
  >("posts");
  const [posts, setPosts] = useState(mockUserPosts);

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

          {/* Bio */}
          <div className="mb-4">
            <p className="text-primary-600">
              {user?.bio ||
                "Building amazing social experiences with React and TypeScript. Love clean code and great UX! 🚀"}
            </p>
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
              <span className="font-bold text-primary-600">127</span>{" "}
              <span className="text-primary-400">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-primary-600">1.2K</span>{" "}
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
              {posts.map((post) => (
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
