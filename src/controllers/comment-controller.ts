import { Request, Response } from "express";
import {
  insertComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
} from "../repositories/comment-repository.js";

// Add comments to posts
export const createComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { post_id } = req.params as { post_id: string };
  if (!post_id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNum = parseInt(post_id, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).json({ message: "Invalid Post ID" });
  }

  const { comment } = req.body as { comment: string };
  if (!comment) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const result = await insertComment(userId, postIdNum, comment);
    return res
      .status(201)
      .json({ message: "Comment created successfully", comment: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create comment" });
  }
};

// Update comments
export const handelUpdateComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { comment_id } = req.params as { comment_id: string };
  if (!comment_id) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const commentIdNum = parseInt(comment_id, 10);
  if (isNaN(commentIdNum)) {
    return res.status(400).json({ message: "Invalid Comment ID" });
  }

  const { comment } = req.body as { comment: string };
  if (!comment) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const result = await updateComment(commentIdNum, comment);
    if (!result) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res
      .status(200)
      .json({ message: "Comment updated successfully", comment: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update comment" });
  }
};

// Delete comments

export const handleDeleteComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { comment_id } = req.params as { comment_id: string };
  if (!comment_id) {
    return res.status(400).json({ message: "Comment ID is required" });
  }
  const commentIdNum = parseInt(comment_id, 10);
  if (isNaN(commentIdNum)) {
    return res.status(400).json({ message: "Invalid Comment ID" });
  }
  try {
    await deleteComment(commentIdNum, userId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};
// List comments for a post
export const listCommentsByPost = async (req: Request, res: Response) => {
  const { post_id } = req.params as { post_id: string };
  if (!post_id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNum = parseInt(post_id, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).json({ message: "Invalid Post ID" });
  }

  try {
    const comments = await getCommentsByPostId(postIdNum);
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve comments" });
  }
};
