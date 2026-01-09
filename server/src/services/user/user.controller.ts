import { z } from "zod";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  checkUsernameExists,
  checkPhoneExists,
  getUserById,
  getUserByIdWithPassword,
  updateUserProfile,
  updateUserPassword,
} from "./user.repository.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateAvatarPublicId,
  addCloudinaryUrlToUser,
} from "../upload/cloudinary.service.js";

import {
  profileUpdateSchema,
  changePasswordSchema,
} from "./user.validation.js";

/**
 * Get current user's profile
 * GET /profile
 */
export const handleUserProfileGet = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userProfile = await getUserById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Raw user profile from DB:", userProfile);
    const userWithAvatarUrl = addCloudinaryUrlToUser(userProfile);
    console.log("User profile with Cloudinary URL:", userWithAvatarUrl);

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user: userWithAvatarUrl,
    });
  } catch (profileGetError) {
    console.error("Profile get error:", profileGetError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update user profile
 * PUT /profile
 */
export const handleProfileUpdate = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Validate request body with Zod schema
    const validatedData = profileUpdateSchema.parse(req.body);
    const { username, phone, bio, isPrivate } = validatedData;

    const file = req.file; // Avatar file from multer
    const currentUser = await getUserById(userId);

    // Check username uniqueness if changed
    if (username !== undefined && currentUser?.username !== username) {
      if (await checkUsernameExists(username)) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    // Check phone uniqueness if changed
    if (phone !== undefined && phone !== "" && currentUser?.phone !== phone) {
      if (await checkPhoneExists(phone)) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }

    const updateData: {
      username?: string;
      phone?: string;
      bio?: string;
      avatarUrl?: string;
      isPrivate?: boolean;
    } = {};

    if (username !== undefined) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone === "" ? "" : phone;
    if (bio !== undefined) updateData.bio = bio;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    // Handle avatar upload
    if (file) {
      // Delete old avatar from Cloudinary if exists
      if (currentUser?.avatarUrl) {
        await deleteFromCloudinary(currentUser.avatarUrl, "avatars");
      }

      // Upload new avatar
      const customPublicId = generateAvatarPublicId(userId);
      const avatarPublicId = await uploadToCloudinary(
        file.buffer,
        "avatars",
        customPublicId
      );
      updateData.avatarUrl = avatarPublicId;
    }

    const profileUpdateResult = await updateUserProfile(userId, updateData);

    if (!profileUpdateResult) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile update result from DB:", profileUpdateResult);
    const userWithAvatarUrl = addCloudinaryUrlToUser(profileUpdateResult);
    console.log("Profile update with Cloudinary URL:", userWithAvatarUrl);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userWithAvatarUrl,
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    console.error("Profile update error:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      if (error.message.includes("username")) {
        return res.status(409).json({ message: "Username already exists" });
      }
      if (error.message.includes("phone")) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Change user password
 * PUT /password
 */
export const handlePasswordChange = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUserWithPassword = await getUserByIdWithPassword(userId);
    if (!currentUserWithPassword) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentUserWithPassword.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    await updateUserPassword(userId, newPassword);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error(
      "Change password error:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
