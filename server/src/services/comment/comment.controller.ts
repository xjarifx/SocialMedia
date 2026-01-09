import { Request, Response } from "express";
import { z } from "zod";
import {
  insertComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
} from "./comment.repository.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "./comment.validation.js";

// Add comments to posts
export const handleCreateComment = async (req: Request, res: Response) => {
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
    return res.status(400).json({ message: "Invalid Post ID" });
  }

  try {
    // Use Zod validation
    const { content } = createCommentSchema.parse({
      content: req.body.comment,
      postId: postIdNumber,
    });

    const createdComment = await insertComment(userId, postIdNumber, content);
    return res
      .status(201)
      .json({ message: "Comment created", comment: createdComment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error("Comment creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update comments
export const handleUpdateComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { commentId } = req.params as { commentId: string };
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const commentIdNumber = parseInt(commentId, 10);
  if (isNaN(commentIdNumber) || commentIdNumber <= 0) {
    return res.status(400).json({ message: "Invalid Comment ID" });
  }

  try {
    // Use Zod validation for comment content
    const { content } = updateCommentSchema.parse({
      content: req.body.comment,
    });

    const updatedComment = await updateComment(commentIdNumber, content);
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error("Comment update error:", error);
    return res.status(500).json({ message: "Failed to update comment" });
  }
};

// Delete comments

export const handleDeleteComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { commentId } = req.params as { commentId: string };
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }
  const commentIdNumber = parseInt(commentId, 10);
  if (isNaN(commentIdNumber) || commentIdNumber <= 0) {
    return res.status(400).json({ message: "Invalid Comment ID" });
  }
  try {
    await deleteComment(commentIdNumber, userId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (commentDeletionError) {
    console.error("Error deleting comment:", commentDeletionError);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};
// List comments for a post
export const handleGetCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid Post ID" });
  }

  try {
    const postComments = await getCommentsByPostId(postIdNumber);
    return res.status(200).json({ comments: postComments });
  } catch (commentRetrievalError) {
    return res.status(500).json({ message: "Failed to retrieve comments" });
  }
};
