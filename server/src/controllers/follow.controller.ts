import type { Request, Response } from "express";
import {
  getUserByUsername,
  checkIfFollowing,
  insertFollower,
  deleteFollower,
  getFollowers,
  getFollowing,
} from "../repositories/follow.repository.js";
import { addCloudinaryUrlToUser } from "../services/cloudinary.service.js";

/**
 * Follow a user
 * POST /:targetUsername/follow
 */
export const handleFollowUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUsername = req.params.targetUsername;

  if (
    !targetUsername ||
    typeof targetUsername !== "string" ||
    targetUsername.trim().length === 0
  ) {
    return res.status(400).json({ message: "Invalid target username" });
  }

  // Validate username format and length
  if (targetUsername.length > 50 || targetUsername.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must be between 3 and 50 characters" });
  }

  try {
    const targetUser = await getUserByUsername(targetUsername);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const targetUserId = targetUser.id;

    if (targetUserId === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const isAlreadyFollowing = await checkIfFollowing(userId, targetUserId);
    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    await insertFollower(userId, targetUserId);

    return res.status(200).json({ message: "Successfully followed the user" });
  } catch (followUserError) {
    console.error("Follow user error:", followUserError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Unfollow a user
 * DELETE /:targetUsername/unfollow
 */
export const handleUnfollowUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUsername = req.params.targetUsername;

  if (
    !targetUsername ||
    typeof targetUsername !== "string" ||
    targetUsername.trim().length === 0
  ) {
    return res.status(400).json({ message: "Invalid target username" });
  }

  // Validate username format and length
  if (targetUsername.length > 50 || targetUsername.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must be between 3 and 50 characters" });
  }

  try {
    const targetUser = await getUserByUsername(targetUsername);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const targetUserId = targetUser.id;
    if (targetUserId === userId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }
    const isFollowing = await checkIfFollowing(userId, targetUserId);
    if (!isFollowing) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    await deleteFollower(userId, targetUserId);

    return res
      .status(200)
      .json({ message: "Successfully unfollowed the user" });
  } catch (unfollowUserError) {
    console.error("Unfollow user error:", unfollowUserError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get list of followers
 * GET /followers
 */
export const handleGetFollowers = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const followers = await getFollowers(userId);
    const followersWithUrls = followers.map((follower) =>
      addCloudinaryUrlToUser(follower)
    );
    return res.status(200).json(followersWithUrls);
  } catch (getFollowersError) {
    console.error("Get followers error:", getFollowersError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get list of users being followed
 * GET /following
 */
export const handleGetFollowing = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const following = await getFollowing(userId);
    const followingWithUrls = following.map((user) =>
      addCloudinaryUrlToUser(user)
    );
    return res.status(200).json(followingWithUrls);
  } catch (getFollowingError) {
    console.error("Get following error:", getFollowingError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Check if current user follows target user
 * GET /:targetUsername/follow-status
 */
export const handleCheckFollowStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUsername = req.params.targetUsername;
  if (
    !targetUsername ||
    typeof targetUsername !== "string" ||
    targetUsername.trim().length === 0
  ) {
    return res.status(400).json({ message: "Invalid target username" });
  }

  // Validate username format and length
  if (targetUsername.length > 50 || targetUsername.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must be between 3 and 50 characters" });
  }

  try {
    const targetUser = await getUserByUsername(targetUsername);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const isFollowing = await checkIfFollowing(userId, targetUser.id);
    return res.status(200).json({ isFollowing });
  } catch (error) {
    console.error("Check follow status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
