"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  usersAPI,
  followsAPI,
  likesAPI,
  postsAPI,
} from "@/services/api";
import type { User, Follower } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import { useBlocks } from "@/context/BlockContext";
import { Feed, CommentsModal, EditPostModal, ProBadge } from "@/components";
import type { PostProps } from "@/components";
import { useComments } from "@/hooks";
import { transformPost } from "@/utils";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useAuth();
  const { blockedUsers } = useBlocks();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingVisibility, setEditingVisibility] = useState<
    "PUBLIC" | "PRIVATE"
  >("PUBLIC");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const comments = useComments();

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
    document.documentElement.style.overflow =
      comments.openCommentsPostId || editingPostId ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [comments.openCommentsPostId, editingPostId]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const current = await usersAPI.getCurrentProfile();
        setProfile(current);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const currentUserId = user?.id || profile?.id;
      if (!currentUserId) return;
      try {
        setPostsLoading(true);
        setPostsError(null);
        const response = await usersAPI.getUserPosts(currentUserId, 20, 0);
        setPosts(response.posts.map((p) => transformPost(p, user?.id)));
      } catch (err) {
        setPostsError(
          err instanceof Error ? err.message : "Failed to load posts",
        );
      } finally {
        setPostsLoading(false);
      }
    };
    loadPosts();
  }, [profile?.id, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      followsAPI.getUserFollowers(user.id),
      followsAPI.getUserFollowing(user.id),
    ])
      .then(([f, g]) => {
        setFollowers(Array.isArray(f) ? f : []);
        setFollowing(Array.isArray(g) ? g : []);
      })
      .catch((err) =>
        console.error("Failed to load followers/following:", err),
      );
  }, [user?.id]);

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

  const handleEditPost = useCallback(
    (postId: string, content: string) => {
      const post = posts.find((item) => item.id === postId);
      setEditingPostId(postId);
      setEditingContent(content);
      setEditingVisibility(post?.visibility || "PUBLIC");
    },
    [posts],
  );

  const handleSaveEditPost = async () => {
    if (!editingPostId || !editingContent.trim()) {
      return;
    }

    try {
      setIsSavingEdit(true);
      await postsAPI.updatePost(
        editingPostId,
        editingContent.trim(),
        editingVisibility,
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPostId
            ? {
                ...p,
                content: editingContent.trim(),
                visibility: editingVisibility,
              }
            : p,
        ),
      );
      setEditingPostId(null);
      setEditingContent("");
      setEditingVisibility("PUBLIC");
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error("Failed to update post:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const selectedPost = comments.openCommentsPostId
    ? (posts.find((p) => p.id === comments.openCommentsPostId) ?? null)
    : null;

  return (
    <div>
      {/* Profile Hero Card */}
      <div className="border-b border-border bg-background">
        {/* Profile Info */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-end gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent text-2xl font-semibold text-white shadow-card">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div className="min-w-0 pb-1">
                <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
                  {profile?.firstName} {profile?.lastName}
                  <ProBadge isPro={profile?.plan === "PRO"} />
                </h2>
                <p className="text-sm text-text-secondary">@{profile?.username}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push("/profile/edit")}
              className="shrink-0"
            >
              Edit profile
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => router.push("/followers")}
              className="flex-1 cursor-pointer rounded-xl border border-border bg-surface px-4 py-3 text-center transition-colors duration-200 hover:bg-surface-hover"
            >
              <p className="text-xl font-bold text-text-primary">
                {followers.length}
              </p>
              <p className="text-xs text-text-secondary">Followers</p>
            </button>
            <button
              onClick={() => router.push("/following")}
              className="flex-1 cursor-pointer rounded-xl border border-border bg-surface px-4 py-3 text-center transition-colors duration-200 hover:bg-surface-hover"
            >
              <p className="text-xl font-bold text-text-primary">
                {following.length}
              </p>
              <p className="text-xs text-text-secondary">Following</p>
            </button>
            <button
              onClick={() => router.push("/blocks")}
              className="flex-1 cursor-pointer rounded-xl border border-border bg-surface px-4 py-3 text-center transition-colors duration-200 hover:bg-surface-hover"
            >
              <p className="text-xl font-bold text-text-primary">
                {blockedUsers.length}
              </p>
              <p className="text-xs text-text-secondary">Blocked</p>
            </button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        {postsError && (
          <div className="mb-4 rounded-xl border border-[#ea4335]/30 bg-[#fce8e6] px-4 py-3 text-[13px] text-[#c5221f]">
            {postsError}
          </div>
        )}
        <Feed
          posts={posts}
          isLoading={postsLoading}
          showPostMenu={true}
          onLike={handleLike}
          onReply={comments.toggleComments}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      </div>

      {editingPostId && (
        <EditPostModal
          editingContent={editingContent}
          visibility={editingVisibility}
          isSaving={isSavingEdit}
          onClose={() => {
            setEditingPostId(null);
            setEditingContent("");
            setEditingVisibility("PUBLIC");
          }}
          onSave={handleSaveEditPost}
          onContentChange={setEditingContent}
          onVisibilityChange={setEditingVisibility}
        />
      )}

      {comments.openCommentsPostId && selectedPost && (
        <CommentsModal
          post={selectedPost}
          commentsApi={comments}
          onClose={comments.handleCloseComments}
          onLike={handleLike}
        />
      )}
    </div>
  );
}
