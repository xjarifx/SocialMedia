import { useState, useCallback } from "react";
import { commentsAPI } from "@/lib/services/api";
import type { Comment as ApiComment } from "@/lib/services/api";

interface CommentMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface UseCommentsReturn {
  openCommentsPostId: string | null;
  commentsByPost: Record<string, ApiComment[]>;
  commentMetaByPost: Record<string, CommentMeta>;
  repliesByComment: Record<string, ApiComment[]>;
  replyMetaByComment: Record<string, CommentMeta>;
  repliesExpanded: Record<string, boolean>;
  replyDrafts: Record<string, string>;
  repliesLoading: Record<string, boolean>;
  repliesMoreLoading: Record<string, boolean>;
  commentLikeState: Record<string, { liked: boolean; count: number }>;
  editingCommentByPost: Record<string, string | null>;
  commentEditDrafts: Record<string, string>;
  commentDrafts: Record<string, string>;
  commentsLoading: Record<string, boolean>;
  commentsMoreLoading: Record<string, boolean>;
  toggleComments: (postId: string) => Promise<void>;
  handleAddComment: (postId: string) => Promise<void>;
  handleAddReply: (postId: string, parentId: string) => Promise<void>;
  toggleReplies: (postId: string, commentId: string) => Promise<void>;
  handleLoadMoreReplies: (postId: string, commentId: string) => Promise<void>;
  setReplyDraft: (commentId: string, value: string) => void;
  handleToggleCommentLike: (postId: string, commentId: string) => Promise<void>;
  handleStartEditComment: (postId: string, comment: ApiComment) => void;
  handleCancelEditComment: (postId: string, commentId: string) => void;
  handleSaveEditComment: (postId: string, commentId: string) => Promise<void>;
  handleDeleteComment: (postId: string, commentId: string) => Promise<void>;
  handleLoadMoreComments: (postId: string) => Promise<void>;
  handleCloseComments: () => void;
  setCommentDraft: (postId: string, value: string) => void;
  setCommentEditDraft: (commentId: string, value: string) => void;
  /** Must be called by the consumer to update its posts state reply count */
  onReplyCountChange: ((postId: string, delta: number) => void) | null;
  setOnReplyCountChange: (cb: (postId: string, delta: number) => void) => void;
}

const PAGE_SIZE = 5;

export function useComments(): UseCommentsReturn {
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(
    null,
  );
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, ApiComment[]>
  >({});
  const [commentMetaByPost, setCommentMetaByPost] = useState<
    Record<string, CommentMeta>
  >({});
  const [repliesByComment, setRepliesByComment] = useState<
    Record<string, ApiComment[]>
  >({});
  const [replyMetaByComment, setReplyMetaByComment] = useState<
    Record<string, CommentMeta>
  >({});
  const [repliesExpanded, setRepliesExpanded] = useState<
    Record<string, boolean>
  >({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [repliesLoading, setRepliesLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [repliesMoreLoading, setRepliesMoreLoading] = useState<
    Record<string, boolean>
  >({});
  const [commentLikeState, setCommentLikeState] = useState<
    Record<string, { liked: boolean; count: number }>
  >({});
  const [editingCommentByPost, setEditingCommentByPost] = useState<
    Record<string, string | null>
  >({});
  const [commentEditDrafts, setCommentEditDrafts] = useState<
    Record<string, string>
  >({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {},
  );
  const [commentsLoading, setCommentsLoading] = useState<
    Record<string, boolean>
  >({});
  const [commentsMoreLoading, setCommentsMoreLoading] = useState<
    Record<string, boolean>
  >({});
  const [replyCountCb, setReplyCountCb] = useState<
    ((postId: string, delta: number) => void) | null
  >(null);

  const seedLikeState = useCallback((items: ApiComment[]) => {
    setCommentLikeState((prev) => {
      const next = { ...prev };
      for (const item of items) {
        next[item.id] = {
          liked: next[item.id]?.liked ?? false,
          count: item.likesCount,
        };
      }
      return next;
    });
  }, []);

  const updateCommentInCollections = useCallback(
    (commentId: string, updater: (comment: ApiComment) => ApiComment) => {
      setCommentsByPost((prev) => {
        let updated = false;
        const next = { ...prev };
        Object.keys(next).forEach((postId) => {
          const list = next[postId];
          const index = list.findIndex((item) => item.id === commentId);
          if (index >= 0) {
            const updatedList = [...list];
            updatedList[index] = updater(updatedList[index]);
            next[postId] = updatedList;
            updated = true;
          }
        });
        return updated ? next : prev;
      });

      setRepliesByComment((prev) => {
        let updated = false;
        const next = { ...prev };
        Object.keys(next).forEach((parentId) => {
          const list = next[parentId];
          const index = list.findIndex((item) => item.id === commentId);
          if (index >= 0) {
            const updatedList = [...list];
            updatedList[index] = updater(updatedList[index]);
            next[parentId] = updatedList;
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    },
    [],
  );

  const toggleComments = useCallback(
    async (postId: string) => {
      const nextOpen = openCommentsPostId === postId ? null : postId;
      setOpenCommentsPostId(nextOpen);

      if (nextOpen && !commentsByPost[postId]) {
        // Load comment draft from localStorage
        try {
          const key = `comment-draft-${postId}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);
            const isExpired = Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000; // 7 days
            if (!isExpired && data.content) {
              setCommentDrafts((prev) => ({ ...prev, [postId]: data.content }));
            } else if (isExpired) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error('Failed to load comment draft:', error);
        }

        try {
          setCommentsLoading((prev) => ({ ...prev, [postId]: true }));
          const response = await commentsAPI.getPostComments(postId, {
            limit: PAGE_SIZE,
            offset: 0,
            parentId: null,
          });
          setCommentsByPost((prev) => ({
            ...prev,
            [postId]: response.comments,
          }));
          seedLikeState(response.comments);
          setCommentMetaByPost((prev) => ({
            ...prev,
            [postId]: {
              total: response.total,
              limit: response.limit,
              offset: response.comments.length,
            },
          }));
        } catch (err) {
          console.error("Failed to load comments:", err);
        } finally {
          setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
        }
      }
    },
    [openCommentsPostId, commentsByPost, seedLikeState],
  );

  const handleAddComment = useCallback(
    async (postId: string) => {
      const content = (commentDrafts[postId] || "").trim();
      if (!content) return;

      try {
        const newComment = await commentsAPI.createComment(postId, content);
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])],
        }));
        seedLikeState([newComment]);
        setCommentMetaByPost((prev) => {
          const current = prev[postId];
          if (!current) {
            return {
              ...prev,
              [postId]: { total: 1, limit: PAGE_SIZE, offset: 1 },
            };
          }
          return {
            ...prev,
            [postId]: {
              ...current,
              total: current.total + 1,
              offset: current.offset + 1,
            },
          };
        });
        setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
        // Clear from localStorage
        try {
          localStorage.removeItem(`comment-draft-${postId}`);
        } catch (error) {
          console.error('Failed to clear comment draft:', error);
        }
        replyCountCb?.(postId, 1);
      } catch (err) {
        console.error("Failed to create comment:", err);
      }
    },
    [commentDrafts, replyCountCb, seedLikeState],
  );

  const handleAddReply = useCallback(
    async (postId: string, parentId: string) => {
      const content = (replyDrafts[parentId] || "").trim();
      if (!content) return;

      try {
        const newComment = await commentsAPI.createComment(
          postId,
          content,
          parentId,
        );
        setRepliesByComment((prev) => ({
          ...prev,
          [parentId]: [newComment, ...(prev[parentId] || [])],
        }));
        seedLikeState([newComment]);
        setReplyMetaByComment((prev) => {
          const current = prev[parentId];
          if (!current) {
            return {
              ...prev,
              [parentId]: { total: 1, limit: PAGE_SIZE, offset: 1 },
            };
          }
          return {
            ...prev,
            [parentId]: {
              ...current,
              total: current.total + 1,
              offset: current.offset + 1,
            },
          };
        });
        setReplyDrafts((prev) => ({ ...prev, [parentId]: "" }));
        // Clear from localStorage
        try {
          localStorage.removeItem(`reply-draft-${parentId}`);
        } catch (error) {
          console.error('Failed to clear reply draft:', error);
        }
        updateCommentInCollections(parentId, (comment) => ({
          ...comment,
          repliesCount: comment.repliesCount + 1,
        }));
        replyCountCb?.(postId, 1);
      } catch (err) {
        console.error("Failed to create reply:", err);
      }
    },
    [replyDrafts, replyCountCb, seedLikeState, updateCommentInCollections],
  );

  const handleStartEditComment = useCallback(
    (postId: string, comment: ApiComment) => {
      setEditingCommentByPost((prev) => ({ ...prev, [postId]: comment.id }));
      setCommentEditDrafts((prev) => ({
        ...prev,
        [comment.id]: comment.content,
      }));
    },
    [],
  );

  const handleCancelEditComment = useCallback(
    (postId: string, commentId: string) => {
      setEditingCommentByPost((prev) => ({ ...prev, [postId]: null }));
      setCommentEditDrafts((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
    },
    [],
  );

  const handleSaveEditComment = useCallback(
    async (postId: string, commentId: string) => {
      const content = (commentEditDrafts[commentId] || "").trim();
      if (!content) return;

      try {
        const updated = await commentsAPI.updateComment(
          postId,
          commentId,
          content,
        );
        updateCommentInCollections(commentId, (comment) => ({
          ...comment,
          content: updated.content,
        }));
        handleCancelEditComment(postId, commentId);
      } catch (err) {
        console.error("Failed to update comment:", err);
      }
    },
    [commentEditDrafts, handleCancelEditComment, updateCommentInCollections],
  );

  const handleDeleteComment = useCallback(
    async (postId: string, commentId: string) => {
      try {
        const result = await commentsAPI.deleteComment(postId, commentId);
        let deletedParentId: string | null | undefined;
        setCommentsByPost((prev) => {
          const list = prev[postId] || [];
          const target = list.find((c) => c.id === commentId);
          deletedParentId = target?.parentId;
          return {
            ...prev,
            [postId]: list.filter((c) => c.id !== commentId),
          };
        });
        setRepliesByComment((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((parentId) => {
            const list = next[parentId];
            const target = list.find((c) => c.id === commentId);
            if (target) {
              deletedParentId = target.parentId;
            }
            next[parentId] = list.filter((c) => c.id !== commentId);
          });
          delete next[commentId];
          return next;
        });
        const deletedCount = result?.deletedCount ?? 1;
        setCommentMetaByPost((prev) => {
          if (deletedParentId !== null) return prev;
          const current = prev[postId];
          if (!current) return prev;
          return {
            ...prev,
            [postId]: {
              ...current,
              total: Math.max(0, current.total - deletedCount),
              offset: Math.max(0, current.offset - deletedCount),
            },
          };
        });
        setReplyMetaByComment((prev) => {
          if (!deletedParentId) return prev;
          const current = prev[deletedParentId];
          if (!current) return prev;
          return {
            ...prev,
            [deletedParentId]: {
              ...current,
              total: Math.max(0, current.total - deletedCount),
              offset: Math.max(0, current.offset - deletedCount),
            },
          };
        });
        if (deletedParentId) {
          updateCommentInCollections(deletedParentId, (comment) => ({
            ...comment,
            repliesCount: Math.max(0, comment.repliesCount - deletedCount),
          }));
        }
        replyCountCb?.(postId, -deletedCount);
      } catch (err) {
        console.error("Failed to delete comment:", err);
      }
    },
    [replyCountCb, updateCommentInCollections],
  );

  const handleLoadMoreComments = useCallback(
    async (postId: string) => {
      const currentComments = commentsByPost[postId] || [];
      const meta = commentMetaByPost[postId];
      const nextOffset = currentComments.length;
      const limit = meta?.limit ?? PAGE_SIZE;

      if (meta && currentComments.length >= meta.total) return;

      try {
        setCommentsMoreLoading((prev) => ({ ...prev, [postId]: true }));
        const response = await commentsAPI.getPostComments(postId, {
          limit,
          offset: nextOffset,
          parentId: null,
        });
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), ...response.comments],
        }));
        seedLikeState(response.comments);
        setCommentMetaByPost((prev) => ({
          ...prev,
          [postId]: {
            total: response.total,
            limit: response.limit,
            offset: nextOffset + response.comments.length,
          },
        }));
      } catch (err) {
        console.error("Failed to load more comments:", err);
      } finally {
        setCommentsMoreLoading((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [commentsByPost, commentMetaByPost, seedLikeState],
  );

  const toggleReplies = useCallback(
    async (postId: string, commentId: string) => {
      setRepliesExpanded((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));

      if (repliesByComment[commentId]) return;

      // Load reply draft from localStorage
      try {
        const key = `reply-draft-${commentId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          const isExpired = Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000; // 7 days
          if (!isExpired && data.content) {
            setReplyDrafts((prev) => ({ ...prev, [commentId]: data.content }));
          } else if (isExpired) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.error('Failed to load reply draft:', error);
      }

      try {
        setRepliesLoading((prev) => ({ ...prev, [commentId]: true }));
        const response = await commentsAPI.getPostComments(postId, {
          limit: PAGE_SIZE,
          offset: 0,
          parentId: commentId,
        });
        setRepliesByComment((prev) => ({
          ...prev,
          [commentId]: response.comments,
        }));
        seedLikeState(response.comments);
        setReplyMetaByComment((prev) => ({
          ...prev,
          [commentId]: {
            total: response.total,
            limit: response.limit,
            offset: response.comments.length,
          },
        }));
      } catch (err) {
        console.error("Failed to load replies:", err);
      } finally {
        setRepliesLoading((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [repliesByComment, seedLikeState],
  );

  const handleLoadMoreReplies = useCallback(
    async (postId: string, commentId: string) => {
      const currentReplies = repliesByComment[commentId] || [];
      const meta = replyMetaByComment[commentId];
      const nextOffset = currentReplies.length;
      const limit = meta?.limit ?? PAGE_SIZE;

      if (meta && currentReplies.length >= meta.total) return;

      try {
        setRepliesMoreLoading((prev) => ({ ...prev, [commentId]: true }));
        const response = await commentsAPI.getPostComments(postId, {
          limit,
          offset: nextOffset,
          parentId: commentId,
        });
        setRepliesByComment((prev) => ({
          ...prev,
          [commentId]: [...currentReplies, ...response.comments],
        }));
        seedLikeState(response.comments);
        setReplyMetaByComment((prev) => ({
          ...prev,
          [commentId]: {
            total: response.total,
            limit: response.limit,
            offset: nextOffset + response.comments.length,
          },
        }));
      } catch (err) {
        console.error("Failed to load more replies:", err);
      } finally {
        setRepliesMoreLoading((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [repliesByComment, replyMetaByComment, seedLikeState],
  );

  const setReplyDraft = useCallback((commentId: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: value }));
    // Persist to localStorage
    try {
      const key = `reply-draft-${commentId}`;
      if (value.trim()) {
        localStorage.setItem(key, JSON.stringify({ content: value, timestamp: Date.now() }));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to save reply draft:', error);
    }
  }, []);

  const handleToggleCommentLike = useCallback(
    async (postId: string, commentId: string) => {
      const current = commentLikeState[commentId];
      const liked = current?.liked ?? false;
      const count = current?.count ?? 0;

      setCommentLikeState((prev) => ({
        ...prev,
        [commentId]: {
          liked: !liked,
          count: liked ? Math.max(0, count - 1) : count + 1,
        },
      }));

      try {
        if (liked) {
          await commentsAPI.unlikeComment(postId, commentId);
        } else {
          await commentsAPI.likeComment(postId, commentId);
        }
      } catch (err) {
        setCommentLikeState((prev) => ({
          ...prev,
          [commentId]: { liked, count },
        }));
        console.error("Failed to toggle comment like:", err);
      }
    },
    [commentLikeState],
  );

  const handleCloseComments = useCallback(
    () => setOpenCommentsPostId(null),
    [],
  );

  const setCommentDraft = useCallback((postId: string, value: string) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }));
    // Persist to localStorage
    try {
      const key = `comment-draft-${postId}`;
      if (value.trim()) {
        localStorage.setItem(key, JSON.stringify({ content: value, timestamp: Date.now() }));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to save comment draft:', error);
    }
  }, []);

  const setCommentEditDraft = useCallback(
    (commentId: string, value: string) => {
      setCommentEditDrafts((prev) => ({ ...prev, [commentId]: value }));
    },
    [],
  );

  const setOnReplyCountChange = useCallback(
    (cb: (postId: string, delta: number) => void) => {
      setReplyCountCb(() => cb);
    },
    [],
  );

  return {
    openCommentsPostId,
    commentsByPost,
    commentMetaByPost,
    repliesByComment,
    replyMetaByComment,
    repliesExpanded,
    replyDrafts,
    repliesLoading,
    repliesMoreLoading,
    commentLikeState,
    editingCommentByPost,
    commentEditDrafts,
    commentDrafts,
    commentsLoading,
    commentsMoreLoading,
    toggleComments,
    handleAddComment,
    handleAddReply,
    toggleReplies,
    handleLoadMoreReplies,
    setReplyDraft,
    handleToggleCommentLike,
    handleStartEditComment,
    handleCancelEditComment,
    handleSaveEditComment,
    handleDeleteComment,
    handleLoadMoreComments,
    handleCloseComments,
    setCommentDraft,
    setCommentEditDraft,
    onReplyCountChange: replyCountCb,
    setOnReplyCountChange,
  };
}
