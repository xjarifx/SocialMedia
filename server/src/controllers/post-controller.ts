import type { Request, Response } from "express";
import {
  insertPost,
  updatePostById,
  getPostById,
  deletePostById,
  getPostsByUserId,
  getForYouPosts,
  getFollowingPosts, // added
} from "../repositories/post-repository.js";
import {
  getUserByUsername,
  getFollowerCount,
  getFollowingCount,
} from "../repositories/user-repository.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  generatePostPublicId,
  addCloudinaryUrlsToPosts,
  addCloudinaryUrlToUser,
} from "../services/cloudinary-service.js";

// create post
export const handlePostCreation = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { caption } = req.body as { caption?: string };
  const file = req.file;

  if (!caption && !file) {
    return res.status(400).json({ message: "Caption or media is required" });
  }

  try {
    // Step 1: Create post in DB with empty mediaUrl to get postId
    const createdPost = await insertPost(userId, caption || "", "");

    let mediaPublicId = "";

    // Step 2: If media provided, upload to Cloudinary
    if (file) {
      const customPublicId = generatePostPublicId(userId, createdPost.id);
      mediaPublicId = await uploadToCloudinary(
        file.buffer,
        "posts",
        customPublicId,
        file.mimetype
      );

      // Step 3: Update post with public_id
      const updatedPost = await updatePostById(
        createdPost.id,
        caption || "",
        mediaPublicId
      );

      return res.status(201).json({
        message: "Post created successfully",
        post: updatedPost,
      });
    }

    return res.status(201).json({
      message: "Post created successfully",
      post: createdPost,
    });
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

  console.log(
    "Update attempt - User ID:",
    userId,
    "(type:",
    typeof userId,
    ") Post User ID:",
    existingPost.userId,
    "(type:",
    typeof existingPost.userId,
    ")"
  );

  // Ensure both values are numbers for comparison
  if (Number(existingPost.userId) !== Number(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { caption } = req.body as { caption?: string };
  const file = req.file;

  if (!caption && !file) {
    return res.status(400).json({ message: "Caption or media is required" });
  }

  try {
    let mediaPublicId = existingPost.mediaUrl || "";

    // If new media is uploaded
    if (file) {
      // Delete old media from Cloudinary if exists
      if (existingPost.mediaUrl) {
        await deleteFromCloudinary(existingPost.mediaUrl, "posts");
      }

      // Upload new media
      const customPublicId = generatePostPublicId(userId, postIdNumber);
      mediaPublicId = await uploadToCloudinary(
        file.buffer,
        "posts",
        customPublicId,
        file.mimetype
      );
    }

    const updatedPost = await updatePostById(
      postIdNumber,
      caption || existingPost.caption || "",
      mediaPublicId
    );

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
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

  console.log(
    "Delete attempt - User ID:",
    userId,
    "(type:",
    typeof userId,
    ") Post User ID:",
    existingPost.userId,
    "(type:",
    typeof existingPost.userId,
    ")"
  );

  // Ensure both values are numbers for comparison
  if (Number(existingPost.userId) !== Number(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // Delete media from Cloudinary if exists
    if (existingPost.mediaUrl) {
      await deleteFromCloudinary(existingPost.mediaUrl, "posts");
    }

    await deletePostById(postIdNumber);
    return res.status(204).send();
  } catch (postDeletionError) {
    console.error("Post deletion error:", postDeletionError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetOwnPosts = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const posts = await getPostsByUserId(userId, userId);
    const followerCount = await getFollowerCount(userId);
    const followingCount = await getFollowingCount(userId);

    // Convert public_ids to Cloudinary URLs
    const postsWithUrls = addCloudinaryUrlsToPosts(posts);

    return res.status(200).json({
      posts: postsWithUrls,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// for you
export const handleGetForYouPosts = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const posts = await getForYouPosts(userId);
    const postsWithUrls = addCloudinaryUrlsToPosts(posts);
    return res.status(200).json({ posts: postsWithUrls });
  } catch (error) {
    console.error("Error fetching 'For You' posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// following
export const handleGetFollowingPosts = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const posts = await getFollowingPosts(userId);
    const postsWithUrls = addCloudinaryUrlsToPosts(posts);
    return res.status(200).json({ posts: postsWithUrls });
  } catch (error) {
    console.error("Error fetching following posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get posts by username
export const handleGetPostsByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserId = req.user?.id;
    const posts = await getPostsByUserId(user.id, currentUserId);
    const followerCount = await getFollowerCount(user.id);
    const followingCount = await getFollowingCount(user.id);

    const postsWithUrls = addCloudinaryUrlsToPosts(posts);
    const userWithUrl = addCloudinaryUrlToUser(user);

    return res.status(200).json({
      posts: postsWithUrls,
      user: {
        ...userWithUrl,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching posts by username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
