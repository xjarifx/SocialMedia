import { Request, Response } from "express";
import { createPost as createPostQuery } from "../db/query.js";

export const createPost = async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { caption, media_url } = req.body;

  if (!caption && !media_url) {
    return res
      .status(400)
      .json({ message: "caption or media_url are required." });
  }
  
  try {
    const result = await createPostQuery(user_id, caption, media_url);
    const newPost = result.rows[0];
    res
      .status(201)
      .json({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
