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
  {
    id: 5,
    username: "reactdev",
    content:
      "Hot take: React Server Components are going to change everything. The way we think about data fetching and rendering will never be the same. Exciting times ahead! ⚛️",
    createdAt: "12h",
    likes: 203,
    comments: 45,
    reposts: 32,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 6,
    username: "uiuxmaster",
    content:
      "Spent the entire weekend redesigning our mobile app. Sometimes you have to start from scratch to get it right. The new flow is 40% more intuitive! 📱✨",
    createdAt: "1d",
    likes: 145,
    comments: 28,
    reposts: 19,
    isLiked: false,
    isReposted: true,
  },
  {
    id: 7,
    username: "codewarrior",
    content:
      "Debugging a production issue at 2 AM. Coffee count: 4 cups ☕ Status: Still going strong 💪 Sometimes being a developer means being a digital detective.",
    createdAt: "1d",
    likes: 78,
    comments: 15,
    reposts: 6,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 8,
    username: "techstartup",
    content:
      "Just closed our Series A! 🎉 Thank you to everyone who believed in our vision. Time to scale this thing to the moon! 🚀 #startup #funding",
    createdAt: "2d",
    likes: 421,
    comments: 67,
    reposts: 89,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 9,
    username: "frontenddude",
    content:
      "CSS Grid + Flexbox = Perfect layout combination 💯 Stop fighting the browser and embrace modern CSS. Your future self will thank you!",
    createdAt: "2d",
    likes: 192,
    comments: 31,
    reposts: 24,
    isLiked: true,
    isReposted: true,
  },
  {
    id: 10,
    username: "datascientist",
    content:
      "Machine learning models are only as good as the data you feed them. Garbage in, garbage out. Spent 80% of my time this week cleaning datasets 📊",
    createdAt: "3d",
    likes: 234,
    comments: 19,
    reposts: 41,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 11,
    username: "mobileguru",
    content:
      "Flutter vs React Native in 2025? Both are solid choices, but Flutter's performance on complex animations gives it the edge. What's your experience? 📱",
    createdAt: "3d",
    likes: 167,
    comments: 52,
    reposts: 33,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 12,
    username: "devops_ninja",
    content:
      "Kubernetes can be overwhelming at first, but once you understand the concepts, it's like having superpowers for container orchestration ⚡ Worth the learning curve!",
    createdAt: "4d",
    likes: 98,
    comments: 24,
    reposts: 17,
    isLiked: false,
    isReposted: true,
  },
  {
    id: 13,
    username: "webperf",
    content:
      "Shaved 2 seconds off our page load time by optimizing images and implementing lazy loading. Users are already reporting better experience! 🏃‍♂️💨",
    createdAt: "4d",
    likes: 156,
    comments: 18,
    reposts: 22,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 14,
    username: "backendwizard",
    content:
      "Microservices architecture isn't always the answer. Sometimes a well-structured monolith is exactly what you need. Choose based on your actual requirements, not trends 🎯",
    createdAt: "5d",
    likes: 289,
    comments: 73,
    reposts: 45,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 15,
    username: "airesearcher",
    content:
      "OpenAI's latest model is impressive, but remember: AI is a tool to augment human creativity, not replace it. The best results come from human-AI collaboration 🤖🤝👨‍💻",
    createdAt: "5d",
    likes: 412,
    comments: 91,
    reposts: 78,
    isLiked: true,
    isReposted: true,
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
        // Filter for following feed (mock) - expanded to include more users
        setPosts(
          mockPosts.filter((post) =>
            [
              "techguru",
              "designlover",
              "reactdev",
              "uiuxmaster",
              "frontenddude",
              "mobileguru",
              "webperf",
              "airesearcher",
            ].includes(post.username)
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
