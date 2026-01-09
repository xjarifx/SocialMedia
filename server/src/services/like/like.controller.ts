import type { Request, Response } from "express";
import { insertLike, deleteLike, getLikeCount } from "./like.repository.js";

// like
export const handleLikeCreation = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const postIdParam = req.params.postId;
  if (!postIdParam) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postId = parseInt(postIdParam, 10);
  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const newLike = await insertLike(userId, postId);
    return res
      .status(201)
      .json({ message: "Like created successfully", like: newLike });
  } catch (likeCreationError) {
    console.error("Error creating like:", likeCreationError);
    return res.status(500).json({ message: "Failed to create like" });
  }
};

// unlike
export const handleLikeDeletion = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const postIdParam = req.params.postId;
  if (!postIdParam) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postId = parseInt(postIdParam, 10);
  if (isNaN(postId) || postId <= 0) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    await deleteLike(userId, postId);
    return res.status(204).json({ message: "Like deleted successfully" });
  } catch (likeDeletionError) {
    console.error("Error deleting like:", likeDeletionError);
    return res.status(500).json({ message: "Failed to delete like" });
  }
};

// like count
export const handleGetLikeCount = async (req: Request, res: Response) => {
  // in real life, we see like without post id
  const postIdParam = req.params.postId;
  if (!postIdParam) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postId = parseInt(postIdParam, 10);
  if (isNaN(postId) || postId <= 0) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const likeCount = await getLikeCount(postId);
    return res.status(200).json({ postId, likeCount });
  } catch (likeCountRetrievalError) {
    console.error("Error retrieving like count:", likeCountRetrievalError);
    return res.status(500).json({ message: "Failed to retrieve like count" });
  }
};
