import { z } from "zod";
import type { Request, Response } from "express";
import {
  checkEmailExists,
  checkUsernameExists,
  checkPhoneExists,
  insertUser,
  getUserByEmail,
  getUserById,
  getUserByIdWithPassword,
  updateUserProfile,
  updateUserPassword,
  getUserByUsername,
  checkIfFollowing,
  insertFollower,
  deleteFollower,
  getFollowers,
  getFollowing,
} from "../repositories/user-repository.js";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidPhoneNumber,
} from "../utils/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateAvatarPublicId,
  addCloudinaryUrlToUser,
} from "../services/cloudinary-service.js";

const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must not exceed 255 characters")
    .trim()
    .toLowerCase(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(1, "Password is required").max(128, "Invalid password length"),
});

const profileUpdateSchema = z.object({
  username: z.string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/)
    .trim()
    .optional(),
  phone: z.string()
    .regex(/^(\+?\d{1,3}[- ]?)?(\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{4}$/)
    .or(z.literal(""))
    .optional(),
  bio: z.string()
    .max(500, "Bio must not exceed 500 characters")
    .trim()
    .transform(val => val.replace(/<[^>]*>/g, "")) // Strip HTML tags
    .optional(),
  isPrivate: z.boolean().optional(),
  avatar: z.string()
    .url("Invalid avatar URL")
    .max(500)
    .optional()
}).strict(); // Reject unknown fields

export const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, username, password } = validatedData;

    if (await checkEmailExists(email)) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (await checkUsernameExists(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const userInsertResult = await insertUser(email, username, password);
    const newUser = userInsertResult.rows[0];

    const userWithAvatarUrl = addCloudinaryUrlToUser(newUser);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: userWithAvatarUrl.id,
        email: userWithAvatarUrl.email,
        username: userWithAvatarUrl.username,
        avatarUrl: userWithAvatarUrl.avatarUrl,
        bio: userWithAvatarUrl.bio,
        phone: userWithAvatarUrl.phone,
        isPrivate: userWithAvatarUrl.isPrivate,
        createdAt: userWithAvatarUrl.createdAt,
        updatedAt: userWithAvatarUrl.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error(
      "Registration error:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Email and password must be strings" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const authenticatedUser = await getUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(
      password,
      authenticatedUser?.password || ""
    );

    // Always return same error message to prevent timing attacks
    if (!authenticatedUser || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const authenticationToken = jwt.sign(
      {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        username: authenticatedUser.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    const userWithAvatarUrl = addCloudinaryUrlToUser(authenticatedUser);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: userWithAvatarUrl.id,
        email: userWithAvatarUrl.email,
        username: userWithAvatarUrl.username,
        avatarUrl: userWithAvatarUrl.avatarUrl,
        bio: userWithAvatarUrl.bio,
        phone: userWithAvatarUrl.phone,
        isPrivate: userWithAvatarUrl.isPrivate,
        createdAt: userWithAvatarUrl.createdAt,
        updatedAt: userWithAvatarUrl.updatedAt,
      },
      token: authenticationToken,
    });
  } catch (loginError) {
    console.error(
      "Login error:",
      loginError instanceof Error ? loginError.message : loginError
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

    if (
      error instanceof Error &&
      error.message.includes("duplicate key")
    ) {
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

export const handleChangePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return res.status(400).json({ message: "Passwords must be strings" });
  }

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      message:
        "New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    });
  }

  try {
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
  } catch (changePasswordError) {
    console.error(
      "Change password error:",
      changePasswordError instanceof Error
        ? changePasswordError.message
        : changePasswordError
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleFollowUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUsername = req.params.targetUsername;

  if (!targetUsername || typeof targetUsername !== "string") {
    return res.status(400).json({ message: "Invalid target username" });
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

export const handleUnfollowUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUsername = req.params.targetUsername;

  if (!targetUsername || typeof targetUsername !== "string") {
    return res.status(400).json({ message: "Invalid target username" });
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

// View followers/following lists
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

export const handleCheckFollowStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const targetUsername = req.params.targetUsername;
  if (!targetUsername || typeof targetUsername !== "string") {
    return res.status(400).json({ message: "Invalid target username" });
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
