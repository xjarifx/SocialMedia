"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Image, Globe, Lock } from "lucide-react";
import { postsAPI, likesAPI, followsAPI } from "@/lib/services/api";
import { Feed, CommentsModal, Spinner } from "@/components";
import type { PostProps } from "@/components";
import { useAuth } from "@/lib/context/AuthContext";
import { useBlocks } from "@/lib/context/BlockContext";
import { useComments, useDraft } from "@/lib/hooks";
import { transformPost } from "@/lib/transformPost";
import { Button } from "@/components/ui/button";

type FeedTab = "following" | "forYou";

export default function HomePage() {
  const { user } = useAuth();
  const { isBlocked } = useBlocks();
  const pageSize = 20;
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [forYouPosts, setForYouPosts] = useState<PostProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<FeedTab>("forYou");
  const [followingOffset, setFollowingOffset] = useState(0);
  const [forYouOffset, setForYouOffset] = useState(0);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [hasMoreForYou, setHasMoreForYou] = useState(true);
  const {
    draft: composerText,
    setDraft: setComposerText,
    clearDraft: clearComposerDraft,
  } = useDraft("homepage-composer-draft");
  const [composerVisibility, setComposerVisibility] = useState<
    "PUBLIC" | "PRIVATE"
  >("PUBLIC");
  const [isInlinePosting, setIsInlinePosting] = useState(false);
  const [inlinePostError, setInlinePostError] = useState<string | null>(null);
  const [inlineMediaFile, setInlineMediaFile] = useState<File | null>(null);
  const forYouScrollRef = useRef<HTMLDivElement | null>(null);
  const followingScrollRef = useRef<HTMLDivElement | null>(null);
  const forYouSentinelRef = useRef<HTMLDivElement | null>(null);
  const followingSentinelRef = useRef<HTMLDivElement | null>(null);
  const maxUploadBytes = 50 * 1024 * 1024;

  const comments = useComments();

  // Wire up reply count changes to posts state
  useEffect(() => {
    comments.setOnReplyCountChange((postId: string, delta: number) => {
      const applyReplyDelta = (prev: PostProps[]) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, replies: Math.max(0, p.replies + delta) }
            : p,
        );
      setFollowingPosts(applyReplyDelta);
      setForYouPosts(applyReplyDelta);
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = comments.openCommentsPostId
      ? "hidden"
      : "";
    document.body.style.overflow = comments.openCommentsPostId ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [comments.openCommentsPostId]);

  const refreshFeeds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [followingResponse, forYouResponse] = await Promise.all([
        postsAPI.getFeed(pageSize, 0),
        postsAPI.getForYouFeed(pageSize, 0),
      ]);
      setFollowingPosts(
        followingResponse.map((p) => transformPost(p, user?.id)),
      );
      setForYouPosts(forYouResponse.map((p) => transformPost(p, user?.id)));
      setFollowingOffset(followingResponse.length);
      setForYouOffset(forYouResponse.length);
      setHasMoreFollowing(followingResponse.length === pageSize);
      setHasMoreForYou(forYouResponse.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, user?.id]);

  // Load posts
  useEffect(() => {
    void refreshFeeds();
  }, [refreshFeeds]);

  // Load following IDs
  useEffect(() => {
    if (!user?.id) return;
    followsAPI
      .getUserFollowing(user.id)
      .then((response) => {
        setFollowingIds(
          response
            .map((item) => item.user?.id)
            .filter((id): id is string => Boolean(id)),
        );
      })
      .catch((err) => console.error("Failed to load following:", err));
  }, [user?.id]);

  const followingPostsWithFollowState = useMemo(() => {
    const followingSet = new Set(followingIds);
    return followingPosts
      .filter((post) => !isBlocked(post.author.handle))
      .map((post) => ({
        ...post,
        isFollowing: post.authorId ? followingSet.has(post.authorId) : false,
      }));
  }, [followingPosts, followingIds, isBlocked]);

  const forYouPostsWithFollowState = useMemo(() => {
    const followingSet = new Set(followingIds);
    return forYouPosts
      .filter((post) => !isBlocked(post.author.handle))
      .map((post) => ({
        ...post,
        isFollowing: post.authorId ? followingSet.has(post.authorId) : false,
      }));
  }, [forYouPosts, followingIds, isBlocked]);

  const combinedPosts = useMemo(
    () => [...forYouPosts, ...followingPosts],
    [forYouPosts, followingPosts],
  );

  const combinedPostsWithFollowState = useMemo(
    () => [...forYouPostsWithFollowState, ...followingPostsWithFollowState],
    [forYouPostsWithFollowState, followingPostsWithFollowState],
  );

  const activeHasMore =
    activeTab === "following" ? hasMoreFollowing : hasMoreForYou;

  const handleFollowToggle = useCallback(
    async (authorId: string, isFollowing: boolean) => {
      if (!user?.id) return;
      const original = followingIds;
      try {
        if (isFollowing) {
          setFollowingIds((prev) => prev.filter((id) => id !== authorId));
          await followsAPI.unfollowUser(user.id, authorId);
        } else {
          setFollowingIds((prev) =>
            prev.includes(authorId) ? prev : [...prev, authorId],
          );
          await followsAPI.followUser(user.id, authorId);
        }
      } catch (err) {
        setFollowingIds(original);
        console.error("Failed to follow/unfollow:", err);
      }
    },
    [user?.id, followingIds],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      if (!user?.id) return;
      const post = combinedPosts.find((p) => p.id === postId);
      if (!post) return;

      const updatePostsById = (updater: (post: PostProps) => PostProps) => {
        setFollowingPosts((prev) =>
          prev.map((p) => (p.id === postId ? updater(p) : p)),
        );
        setForYouPosts((prev) =>
          prev.map((p) => (p.id === postId ? updater(p) : p)),
        );
      };

      try {
        // Use the current liked state from the post to determine action
        if (post.liked) {
          await likesAPI.unlikePost(postId);
          // Update parent state after successful API call
          updatePostsById((p) => ({
            ...p,
            liked: false,
            likes: Math.max(0, p.likes - 1),
          }));
        } else {
          await likesAPI.likePost(postId);
          // Update parent state after successful API call
          updatePostsById((p) => ({ ...p, liked: true, likes: p.likes + 1 }));
        }
      } catch (err) {
        console.error("Failed to toggle like:", err);
        // Re-throw so PostCard can handle rollback
        throw err;
      }
    },
    [combinedPosts, user?.id],
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !activeHasMore) return;
    setIsLoadingMore(true);
    try {
      if (activeTab === "following") {
        const response = await postsAPI.getFeed(pageSize, followingOffset);
        setFollowingPosts((prev) => [
          ...prev,
          ...response.map((p) => transformPost(p, user?.id)),
        ]);
        setFollowingOffset((prev) => prev + response.length);
        setHasMoreFollowing(response.length === pageSize);
      } else {
        const response = await postsAPI.getForYouFeed(pageSize, forYouOffset);
        setForYouPosts((prev) => [
          ...prev,
          ...response.map((p) => transformPost(p, user?.id)),
        ]);
        setForYouOffset((prev) => prev + response.length);
        setHasMoreForYou(response.length === pageSize);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    activeHasMore,
    activeTab,
    forYouOffset,
    followingOffset,
    isLoadingMore,
    pageSize,
    user?.id,
  ]);

  const selectedPost = comments.openCommentsPostId
    ? (combinedPostsWithFollowState.find(
        (p) => p.id === comments.openCommentsPostId,
      ) ?? null)
    : null;

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;
  const charLimit = user?.plan === "PRO" ? 100 : 20;
  const charCount = composerText.length;
  const progressPercent = Math.min((charCount / charLimit) * 100, 100);
  const isOverCharLimit = charCount > charLimit;
  const canInlinePost =
    (composerText.trim().length > 0 || Boolean(inlineMediaFile)) &&
    !isInlinePosting &&
    !isOverCharLimit;

  const handleInlineMediaChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setInlinePostError("Please select an image or video file");
        event.target.value = "";
        return;
      }

      if (file.size > maxUploadBytes) {
        setInlinePostError("File size exceeds 50 MB limit");
        event.target.value = "";
        return;
      }

      setInlinePostError(null);
      setInlineMediaFile(file);
      event.target.value = "";
    },
    [maxUploadBytes],
  );

  const handleRemoveInlineMedia = useCallback(() => {
    setInlineMediaFile(null);
  }, []);

  const toggleComposerVisibility = useCallback(() => {
    setComposerVisibility((prev) => (prev === "PUBLIC" ? "PRIVATE" : "PUBLIC"));
  }, []);

  const handleInlinePost = useCallback(async () => {
    if (
      (!composerText.trim() && !inlineMediaFile) ||
      isOverCharLimit ||
      isInlinePosting
    ) {
      return;
    }
    try {
      setIsInlinePosting(true);
      setInlinePostError(null);
      await postsAPI.create(
        composerText.trim(),
        inlineMediaFile,
        composerVisibility,
      );
      clearComposerDraft();
      setInlineMediaFile(null);
      setComposerVisibility("PUBLIC");
      window.dispatchEvent(new Event("post-created"));
      await refreshFeeds();
    } catch (err) {
      setInlinePostError(
        err instanceof Error ? err.message : "Failed to create post",
      );
    } finally {
      setIsInlinePosting(false);
    }
  }, [
    composerText,
    composerVisibility,
    inlineMediaFile,
    isInlinePosting,
    isOverCharLimit,
    refreshFeeds,
    clearComposerDraft,
  ]);

  const renderComposerSection = () => (
    <section className="border-border border-b px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="border-accent bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold text-white">
          {initials || "U"}
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            value={composerText}
            onChange={(event) => setComposerText(event.target.value)}
            placeholder="What is happening?!"
            className="text-text-primary placeholder:text-text-secondary h-16 w-full resize-none bg-transparent text-lg outline-none"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="text-accent flex items-center gap-1">
              <label
                className="duration-200 hover:bg-accent/10 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full transition-colors"
                aria-label="Upload media"
                title="Upload media"
              >
                <Image className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleInlineMediaChange}
                />
              </label>
              <button
                type="button"
                onClick={toggleComposerVisibility}
                className="duration-200 hover:bg-accent/10 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full transition-colors"
                aria-label="Change visibility"
                title={`Visibility: ${composerVisibility.toLowerCase()}`}
              >
                {composerVisibility === "PUBLIC" ? (
                  <Globe className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              onClick={handleInlinePost}
              disabled={!canInlinePost}
              className="rounded-full px-4 py-1.5 text-base font-bold"
            >
              {isInlinePosting ? "Posting..." : "Post"}
            </Button>
          </div>

          {inlineMediaFile && (
            <div className="border-border bg-surface mt-2 flex items-center justify-between rounded-lg border px-3 py-2">
              <p className="text-text-primary truncate text-xs">
                {inlineMediaFile.name}
              </p>
              <button
                type="button"
                onClick={handleRemoveInlineMedia}
                className="text-accent hover:text-accent-hover ml-3 shrink-0 text-xs"
              >
                Remove
              </button>
            </div>
          )}

          <div className="bg-border mt-2 h-1 w-full overflow-hidden rounded-full">
            <div
              className={`h-full transition-all ${
                isOverCharLimit ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p
            className={`mt-1 text-xs ${
              isOverCharLimit ? "text-red-400" : "text-text-secondary"
            }`}
          >
            {charCount}/{charLimit} characters
          </p>
          {inlinePostError && (
            <p className="mt-1 text-xs text-red-400">{inlinePostError}</p>
          )}
        </div>
      </div>
    </section>
  );

  useEffect(() => {
    const sentinel =
      activeTab === "following"
        ? followingSentinelRef.current
        : forYouSentinelRef.current;
    const scrollRoot =
      activeTab === "following"
        ? followingScrollRef.current
        : forYouScrollRef.current;

    if (!sentinel || !scrollRoot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: scrollRoot,
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeTab, handleLoadMore]);

  useEffect(() => {
    const handlePostCreated = () => {
      void refreshFeeds();
    };
    const handleUserBlocked = () => {
      void refreshFeeds();
    };
    const handleUserUnblocked = () => {
      void refreshFeeds();
    };

    window.addEventListener("post-created", handlePostCreated);
    window.addEventListener("user-blocked", handleUserBlocked);
    window.addEventListener("user-unblocked", handleUserUnblocked);

    return () => {
      window.removeEventListener("post-created", handlePostCreated);
      window.removeEventListener("user-blocked", handleUserBlocked);
      window.removeEventListener("user-unblocked", handleUserUnblocked);
    };
  }, [refreshFeeds]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header with Tabs */}
      <div className="border-border bg-background/80 sticky top-0 z-[0] border-b backdrop-blur-md">
        {/* Tab Navigation */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("forYou")}
            className={`hover:bg-surface-hover relative flex-1 px-4 py-4 text-center text-base font-medium transition-colors duration-150 ${
              activeTab === "forYou"
                ? "text-text-primary font-bold"
                : "text-text-secondary"
            }`}
          >
            For you
            {activeTab === "forYou" && (
              <div className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`hover:bg-surface-hover relative flex-1 px-4 py-4 text-center text-base font-medium transition-colors duration-150 ${
              activeTab === "following"
                ? "text-text-primary font-bold"
                : "text-text-secondary"
            }`}
          >
            Following
            {activeTab === "following" && (
              <div className="absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={forYouScrollRef}
          className={`scrollbar-none absolute inset-0 overflow-y-auto pb-24 lg:pb-0 ${
            activeTab === "forYou" ? "block" : "hidden"
          }`}
        >
          {renderComposerSection()}

          {error && (
            <div className="mx-4 my-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <Feed
            posts={forYouPostsWithFollowState}
            isLoading={isLoading}
            onLike={handleLike}
            onReply={comments.toggleComments}
            onFollowToggle={handleFollowToggle}
          />
          <div ref={forYouSentinelRef} className="h-6" />
          {isLoadingMore && activeTab === "forYou" && (
            <div className="flex justify-center pb-6">
              <Spinner />
            </div>
          )}
        </div>
        <div
          ref={followingScrollRef}
          className={`scrollbar-none absolute inset-0 overflow-y-auto pb-24 lg:pb-0 ${
            activeTab === "following" ? "block" : "hidden"
          }`}
        >
          {renderComposerSection()}

          {error && (
            <div className="mx-4 my-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <Feed
            posts={followingPostsWithFollowState}
            isLoading={isLoading}
            onLike={handleLike}
            onReply={comments.toggleComments}
            onFollowToggle={handleFollowToggle}
          />
          <div ref={followingSentinelRef} className="h-6" />
          {isLoadingMore && activeTab === "following" && (
            <div className="flex justify-center pb-6">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      {comments.openCommentsPostId && selectedPost && (
        <CommentsModal
          post={selectedPost}
          commentsApi={comments}
          onClose={comments.handleCloseComments}
          onLike={handleLike}
          onFollowToggle={handleFollowToggle}
        />
      )}
    </div>
  );
}
