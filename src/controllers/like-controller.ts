import type { Request, Response } from "express";
import {
  checkIfUserLikedPost,
  checkIfUserLikedComment,
  insertPostLike,
  insertCommentLike,
  deletePostLike,
  deleteCommentLike,
  getPostLikesCount,
  getCommentLikesCount,
  getPostLikedByUsers,
  getCommentLikedByUsers,
} from "../repositories/like-repository.js";
import { getPostById } from "../repositories/post-repository.js";

export const handlePostLike = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params as { postId: string };
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    // Check if post exists
    const existingPost = await getPostById(postIdNumber);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const hasUserLikedPost = await checkIfUserLikedPost(userId, postIdNumber);
    if (hasUserLikedPost) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const createdPostLike = await insertPostLike(userId, postIdNumber);
    return res.status(201).json({
      message: "Post liked successfully",
      like: createdPostLike,
    });
  } catch (postLikeError) {
    console.error("Post like error:", postLikeError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handlePostUnlike = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params as { postId: string };
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    // Check if user has liked the post
    const hasUserLikedPost = await checkIfUserLikedPost(userId, postIdNumber);
    if (!hasUserLikedPost) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    await deletePostLike(userId, postIdNumber);
    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (postUnlikeError) {
    console.error("Post unlike error:", postUnlikeError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCommentLike = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { commentId } = req.params as { commentId: string };
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const commentIdNumber = parseInt(commentId, 10);
  if (isNaN(commentIdNumber)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    // Check if user already liked the comment
    const hasUserLikedComment = await checkIfUserLikedComment(
      userId,
      commentIdNumber
    );
    if (hasUserLikedComment) {
      return res.status(400).json({ message: "Comment already liked" });
    }

    const createdCommentLike = await insertCommentLike(userId, commentIdNumber);
    return res.status(201).json({
      message: "Comment liked successfully",
      like: createdCommentLike,
    });
  } catch (commentLikeError) {
    console.error("Comment like error:", commentLikeError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCommentUnlike = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { commentId } = req.params as { commentId: string };
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const commentIdNumber = parseInt(commentId, 10);
  if (isNaN(commentIdNumber)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    // Check if user has liked the comment
    const hasUserLikedComment = await checkIfUserLikedComment(
      userId,
      commentIdNumber
    );
    if (!hasUserLikedComment) {
      return res.status(400).json({ message: "Comment not liked yet" });
    }

    await deleteCommentLike(userId, commentIdNumber);
    return res.status(200).json({ message: "Comment unliked successfully" });
  } catch (commentUnlikeError) {
    console.error("Comment unlike error:", commentUnlikeError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetPostLikes = async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const postLikesCount = await getPostLikesCount(postIdNumber);
    const postLikedUsers = await getPostLikedByUsers(postIdNumber);

    return res.status(200).json({
      postId: postIdNumber,
      likesCount: postLikesCount,
      likedBy: postLikedUsers,
    });
  } catch (postLikesRetrievalError) {
    console.error("Get post likes error:", postLikesRetrievalError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetCommentLikes = async (req: Request, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const commentIdNumber = parseInt(commentId, 10);
  if (isNaN(commentIdNumber)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    const commentLikesCount = await getCommentLikesCount(commentIdNumber);
    const commentLikedUsers = await getCommentLikedByUsers(commentIdNumber);

    return res.status(200).json({
      commentId: commentIdNumber,
      likesCount: commentLikesCount,
      likedBy: commentLikedUsers,
    });
  } catch (commentLikesRetrievalError) {
    console.error("Get comment likes error:", commentLikesRetrievalError);
    return res.status(500).json({ message: "Internal server error" });
  }
};
