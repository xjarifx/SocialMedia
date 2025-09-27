import type { Request, Response } from "express";
import {
  insertPost,
  updatePostById,
  getPostById,
  deletePostById,
} from "../repositories/post-repository.js";

// create post
export const handlePostCreation = async (req: Request, res: Response) => {
  const userId = req.user?.id; // const userId = req.user ? req.user.id : undefined;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { caption, mediaUrl } = req.body;
  if (!caption && !mediaUrl) {
    return res.status(400).json({ message: "Caption or media is required" });
  }

  try {
    const createdPost = await insertPost(userId, caption, mediaUrl);
    return res
      .status(201)
      .json({ message: "Post created successfully", post: createdPost });
  } catch (postCreationError) {
    console.error("Post creation error:", postCreationError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// edit post

export const handlePostUpdate = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  // check post existance and ownership
  const existingPost = await getPostById(postIdNumber);

  if (!existingPost) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (existingPost.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { caption, mediaUrl } = req.body;
  if (!caption && !mediaUrl) {
    return res.status(400).json({ message: "Caption or media is required" });
  }
  try {
    const updatedPost = await updatePostById(postIdNumber, caption, mediaUrl);
    return res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (postUpdateError) {
    console.error("Post update error:", postUpdateError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete post

export const handlePostDeletion = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  const existingPost = await getPostById(postIdNumber);
  if (!existingPost) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (existingPost.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    await deletePostById(postIdNumber);
    return res.status(204).send();
  } catch (postDeletionError) {
    console.error("Post deletion error:", postDeletionError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// handlePostGet - fetch single post

// handleAllPostsGet - fetch all posts (pagination, filtering, sorting)

// handleUserFeedGet - user feed: posts from followed users
