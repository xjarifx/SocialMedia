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
} from "../repositories/user-repository.js";
import {
  RegisterRequestBody,
  LoginRequestBody,
  UpdateProfileRequestBody,
} from "../types/user-types.js";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidPhoneNumber,
} from "../utils/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const handleUserRegistration = async (req: Request, res: Response) => {
  const { email, username, password } = req.body as RegisterRequestBody;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email, username, and password" });
  }

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Email, username, and password must be strings" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({
      message:
        "Username must be 3-50 characters long and contain only letters, numbers, and underscores",
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    });
  }

  try {
    if (await checkEmailExists(email)) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (await checkUsernameExists(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const result = await insertUser(email, username, password);
    const newUser = result.rows[0];
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUserLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody;

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

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwtSecret = process.env.JWT_SECRET as string;

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
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

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user: userProfile,
    });
  } catch (profileGetError) {
    console.error("Profile get error:", profileGetError);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUserProfileUpdate = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { username, phone, bio, avatarUrl, isPrivate } =
    req.body as UpdateProfileRequestBody;

  const currentUser = await getUserById(userId);

  if (username !== undefined) {
    if (typeof username !== "string" || !isValidUsername(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-50 characters long and contain only letters, numbers, and underscores",
      });
    }

    if (currentUser?.username !== username) {
      const existingUser = await checkUsernameExists(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }
  }

  if (phone !== undefined && phone !== null) {
    if (
      typeof phone !== "string" ||
      (phone.length > 0 && !isValidPhoneNumber(phone))
    ) {
      return res.status(400).json({
        message: "Invalid phone number format",
      });
    }

    if (phone.length > 0 && currentUser?.phone !== phone) {
      const existingPhone = await checkPhoneExists(phone);
      if (existingPhone) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }
  }

  if (bio !== undefined && bio !== null) {
    if (typeof bio !== "string" || bio.length > 500) {
      return res.status(400).json({
        message: "Bio must be a string with maximum 500 characters",
      });
    }
  }

  if (avatarUrl !== undefined && avatarUrl !== null) {
    if (typeof avatarUrl !== "string" || avatarUrl.length > 500) {
      return res.status(400).json({
        message:
          "Avatar URL must be a valid string with maximum 500 characters",
      });
    }
  }

  if (isPrivate !== undefined && typeof isPrivate !== "boolean") {
    return res.status(400).json({
      message: "isPrivate must be a boolean value",
    });
  }

  try {
    const updateData: {
      username?: string;
      phone?: string;
      bio?: string;
      avatarUrl?: string;
      isPrivate?: boolean;
    } = {};

    if (username !== undefined) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const result = await updateUserProfile(userId, updateData);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: result,
    });
  } catch (profileUpdateError) {
    console.error("Profile update error:", profileUpdateError);

    if (
      profileUpdateError instanceof Error &&
      profileUpdateError.message.includes("duplicate key")
    ) {
      if (profileUpdateError.message.includes("username")) {
        return res.status(409).json({ message: "Username already exists" });
      }
      if (profileUpdateError.message.includes("phone")) {
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
    const user = await getUserByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    await updateUserPassword(userId, newPassword);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(
      "Change password error:",
      error instanceof Error ? error.message : error
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

    // might get error, const targetUserId: any, expecting number
    const isAlreadyFollowing = await checkIfFollowing(userId, targetUserId);
    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    await insertFollower(userId, targetUserId);

    return res.status(200).json({ message: "Successfully followed the user" });
  } catch (error) {
    console.error("Follow user error:", error);
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
  } catch (error) {
    console.error("Unfollow user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// View followers/following lists

export const handleGetFollowers = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  
  

  res.status(501).json({ message: "Not implemented" });
};

export const handleGetFollowing = async (req: Request, res: Response) => {
  // Implementation here
  res.status(501).json({ message: "Not implemented" });
};
