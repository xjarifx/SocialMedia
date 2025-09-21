import { Request, Response } from "express";
import { insertPost, deletePostById } from "../repositories/post-repository.js";
import { CreatePostRequestBody } from "../types/post-types.js";

export const handleCreatePost = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { content, mediaUrl } = req.body as CreatePostRequestBody;

  if (!content && !mediaUrl) {
    return res
      .status(400)
      .json({ message: "Content or media URL is required." });
  }

  try {
    const result = await insertPost(userId, content, mediaUrl);
    const newPost = result.rows[0];
    res
      .status(201)
      .json({ message: "Post created successfully.", post: newPost });
  } catch (createPostError) {
    console.error("Error creating post:", createPostError);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const handleDeletePost = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required." });
  }

  const postIdNumber = parseInt(postId, 10);
  if (isNaN(postIdNumber)) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    // Deletes a post by its ID and user ID
    const result = await deletePostById(userId, postIdNumber);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Post not found or not authorized." });
    }
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (deletePostError) {
    console.error("Error deleting post:", deletePostError);
    res.status(500).json({ message: "Internal server error." });
  }
};
