import type { Request, Response } from "express";
import {
  createPostInDB,
  editPostInDB,
  getPostById,
  deletePostInDB,
} from "../repositories/post-repository.js";

// create post
export const createPost = async (req: Request, res: Response) => {
  const userId = req.user?.id; // const userId = req.user ? req.user.id : undefined;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { caption, media } = req.body;
  if (!caption && !media) {
    return res.status(400).json({ message: "caption or media is required" });
  }

  try {
    const result = await createPostInDB(userId, caption, media);
    return res
      .status(201)
      .json({ message: "Post created successfully", post: result });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// edit post

export const editPost = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  const postIdNum = parseInt(postId, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).json({ message: "Invalid postId" });
  }

  // check post existance and ownership
  const post = await getPostById(postIdNum);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.user_id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { caption, media } = req.body;
  if (!caption && !media) {
    return res.status(400).json({ message: "caption or media is required" });
  }
  try {
    const result = await editPostInDB(postIdNum, caption, media);
    return res
      .status(200)
      .json({ message: "Post updated successfully", post: result });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete post

export const deletePost = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  const postIdNum = parseInt(postId, 10);
  if (isNaN(postIdNum)) {
    return res.status(400).json({ message: "Invalid postId" });
  }

  const post = await getPostById(postIdNum);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.user_id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    await deletePostInDB(postIdNum);
    return res.status(204).send("Deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// fetch single post

// fetch all posts (pagination, filtering, sorting)

// user feed: posts from followed users
