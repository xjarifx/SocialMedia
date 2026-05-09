"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usersAPI, followsAPI, likesAPI, blocksAPI } from "@/lib/services/api";
import type { User, Follower } from "@/lib/services/api";
import { useAuth } from "@/lib/context/AuthContext";
import { useBlocks } from "@/lib/context/BlockContext";
import { Feed, CommentsModal, ProBadge, Spinner } from "@/components";
import type { PostProps } from "@/components";
import { useComments } from "@/lib/hooks";
import { transformPost } from "@/lib/transformPost";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldOff } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const { user } = useAuth();
  const { isBlocked, blockUser, unblockUser } = useBlocks();
  const [profile, setProfile] = useState<User | null>(null);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [userFollowing, setUserFollowing] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [isBlockActionLoading, setIsBlockActionLoading] = useState(false);
  const [blockedByThem, setBlockedByThem] = useState(false);
  const hasInitializedFollowState = useRef(false);

  const comments = useComments();

  const canFollow = useMemo(
    () => !!user?.id && !!userId && user.id !== userId,
    [user?.id, userId],
  );

  useEffect(() => {
    comments.setOnReplyCountChange((postId: string, delta: number) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, replies: Math.max(0, p.replies + delta) }
            : p,
        ),
      );
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = comments.openCommentsPostId
      ? "hidden"
      : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [comments.openCommentsPostId]);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    usersAPI
      .getProfile(userId)
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load user"),
      )
      .finally(() => setIsLoading(false));
  }, [userId]);

  // Check block status
  useEffect(() => {
    if (!userId || !user?.id) return;
    
    blocksAPI
      .checkBlockStatus(userId)
      .then((status) => {
        setBlockedByThem(status.blockedByThem);
      })
      .catch((err) => {
        console.error("Failed to check block status:", err);
      });
  }, [userId, user?.id]);

  useEffect(() => {
    if (!userId) return;
    setPostsLoading(true);
    setPostsError(null);
    usersAPI
      .getUserPosts(userId, 20, 0)
      .then((response) =>
        setPosts(response.posts.map((p) => transformPost(p, user?.id))),
      )
      .catch((err) =>
        setPostsError(
          err instanceof Error ? err.message : "Failed to load posts",
        ),
      )
      .finally(() => setPostsLoading(false));
  }, [user?.id, userId]);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      followsAPI.getUserFollowers(userId),
      followsAPI.getUserFollowing(userId),
    ])
      .then(([followersData, followingData]) => {
        setFollowers(followersData);
        setUserFollowing(followingData);
      })
      .catch((err) => console.error("Failed to load followers/following:", err));
  }, [userId]);

  useEffect(() => {
    if (!user?.id) return;
    followsAPI
      .getUserFollowing(user.id)
      .then(setFollowing)
      .catch((err) => console.error("Failed to load following:", err));
  }, [user?.id]);

  useEffect(() => {
    if (!userId || following.length === 0 || hasInitializedFollowState.current)
      return;
    setIsFollowing(following.some((item) => item.user?.id === userId));
    hasInitializedFollowState.current = true;
  }, [following, userId]);

  useEffect(() => {
    hasInitializedFollowState.current = false;
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!user?.id || !userId) return;
    const wasFollowing = isFollowing;
    const originalFollowing = following;
    try {
      if (isFollowing) {
        setIsFollowing(false);
        setFollowing((prev) => prev.filter((item) => item.user?.id !== userId));
        await followsAPI.unfollowUser(user.id, userId);
        toast.success("Unfollowed successfully");
      } else {
        setIsFollowing(true);
        const tempFollower = {
          id: "temp-" + Date.now(),
          followedAt: new Date().toISOString(),
          user: {
            id: userId,
            username: profile?.username || "",
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
          },
        };
        setFollowing((prev) => [...prev, tempFollower]);
        const response = await followsAPI.followUser(user.id, userId);
        setFollowing((prev) =>
          prev.map((item) => (item.id === tempFollower.id ? response : item)),
        );
        toast.success("Followed successfully");
      }
    } catch (err) {
      setIsFollowing(wasFollowing);
      setFollowing(originalFollowing);
      console.error("Failed to follow/unfollow:", err);
      toast.error("Failed to update follow status");
    }
  };

  const handleBlockToggle = async () => {
    if (!profile?.username) return;
    
    const currentlyBlocked = isBlocked(profile.username);
    
    try {
      setIsBlockActionLoading(true);
      
      if (currentlyBlocked) {
        // Unblock
        await unblockUser(profile.username);
        toast.success("User unblocked");
        
        // Reload posts
        if (userId) {
          const response = await usersAPI.getUserPosts(userId, 20, 0);
          setPosts(response.posts.map((p) => transformPost(p, user?.id)));
        }
      } else {
        // Block
        // If following, unfollow first
        if (isFollowing && user?.id && userId) {
          setIsFollowing(false);
          setFollowing((prev) => prev.filter((item) => item.user?.id !== userId));
          await followsAPI.unfollowUser(user.id, userId);
        }
        
        await blockUser(profile.username);
        
        // Hide posts from blocked user
        setPosts([]);
        
        toast.success("User blocked");
      }
    } catch (err) {
      console.error("Failed to block/unblock user:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update block status");
    } finally {
      setIsBlockActionLoading(false);
    }
  };

  const handleLike = useCallback(
    async (postId: string) => {
      if (!user?.id) return;
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      try {
        if (post.liked) {
          await likesAPI.unlikePost(postId);
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? { ...p, liked: false, likes: Math.max(0, p.likes - 1) }
                : p,
            ),
          );
        } else {
          await likesAPI.likePost(postId);
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId ? { ...p, liked: true, likes: p.likes + 1 } : p,
            ),
          );
        }
      } catch (err) {
        console.error("Failed to toggle like:", err);
        throw err;
      }
    },
    [posts, user?.id],
  );

  const postsWithFollowState = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      isFollowing,
    }));
  }, [posts, isFollowing]);

  const selectedPost = comments.openCommentsPostId
    ? (postsWithFollowState.find((p) => p.id === comments.openCommentsPostId) ??
      null)
    : null;

  const handleFollowTogglePost = useCallback(
    async (authorId: string) => {
      if (authorId !== userId) return;
      await handleFollowToggle();
    },
    [userId],
  );

  return (
    <div>
      {/* Profile Hero */}
      <div className="border-b border-border bg-background">
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {blockedByThem && !isLoading && (
            <div className="mb-4 rounded-xl border border-border bg-surface px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-text-secondary/10">
                <ShieldOff className="h-8 w-8 text-text-secondary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text-primary">
                You've been blocked
              </h3>
              <p className="text-sm text-text-secondary">
                @{profile?.username} has blocked you. You cannot view their profile or interact with them.
              </p>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          )}

          {!blockedByThem && isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : !blockedByThem && (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-end gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent text-2xl font-semibold text-white shadow-card">
                    {profile?.firstName?.[0] || ""}
                    {profile?.lastName?.[0] || ""}
                  </div>
                  <div className="min-w-0 pb-1">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
                      {profile?.firstName} {profile?.lastName}
                      <ProBadge isPro={profile?.plan === "PRO"} />
                    </h2>
                    <p className="text-sm text-text-secondary">
                      @{profile?.username}
                    </p>
                  </div>
                </div>
                
                {canFollow && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant={isFollowing ? "secondary" : "default"}
                      onClick={handleFollowToggle}
                      disabled={isBlocked(profile?.username || "")}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      variant={isBlocked(profile?.username || "") ? "secondary" : "outline"}
                      onClick={handleBlockToggle}
                      disabled={isBlockActionLoading}
                      className={isBlocked(profile?.username || "") ? "" : "text-danger hover:text-danger"}
                    >
                      {isBlockActionLoading ? "..." : isBlocked(profile?.username || "") ? "Blocked" : "Block"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="mt-5 flex gap-2">
                <div className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-center">
                  <p className="text-xl font-bold text-text-primary">
                    {followers.length}
                  </p>
                  <p className="text-xs text-text-secondary">Followers</p>
                </div>
                <div className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-center">
                  <p className="text-xl font-bold text-text-primary">
                    {userFollowing.length}
                  </p>
                  <p className="text-xs text-text-secondary">Following</p>
                </div>
                <div className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-center">
                  <p className="text-xl font-bold text-text-primary">
                    {0}
                  </p>
                  <p className="text-xs text-text-secondary">Blocked</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      {!blockedByThem && (
        <div>
          {isBlocked(profile?.username || "") && (
            <div className="mb-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-muted text-center">
              You have blocked this user. Their posts are hidden.
            </div>
          )}
          {postsError && (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
              {postsError}
            </div>
          )}
          {!isBlocked(profile?.username || "") && (
            <Feed
              posts={postsWithFollowState}
              isLoading={postsLoading}
              showPostMenu={false}
              onLike={handleLike}
              onReply={comments.toggleComments}
              onFollowToggle={handleFollowTogglePost}
            />
          )}
        </div>
      )}

      {comments.openCommentsPostId && selectedPost && (
        <CommentsModal
          post={selectedPost}
          commentsApi={comments}
          onClose={comments.handleCloseComments}
          onLike={handleLike}
          onFollowToggle={handleFollowTogglePost}
        />
      )}
    </div>
  );
}
