export const ERROR_MESSAGES = {
  // Auth
  UNAUTHORIZED: "Unauthorized access",
  INVALID_CREDENTIALS: "Invalid credentials",
  ACCESS_TOKEN_MISSING: "Access token is missing",
  INVALID_ACCESS_TOKEN: "Invalid access token",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  USERNAME_ALREADY_EXISTS: "Username already exists",

  // Validation
  VALIDATION_FAILED: "Validation failed",
  INVALID_EMAIL: "Invalid email format",
  INVALID_PASSWORD: "Invalid password",
  CAPTION_OR_MEDIA_REQUIRED: "Caption or media is required",
  POST_ID_REQUIRED: "Post ID is required",
  INVALID_POST_ID: "Invalid post ID",
  USERNAME_REQUIRED: "Username is required",

  // Resources
  USER_NOT_FOUND: "User not found",
  POST_NOT_FOUND: "Post not found",
  COMMENT_NOT_FOUND: "Comment not found",

  // Permissions
  FORBIDDEN: "Forbidden - You don't have permission",

  // Server
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  LOGIN_SUCCESS: "Login successful",
  POST_CREATED: "Post created successfully",
  POST_UPDATED: "Post updated successfully",
  POST_DELETED: "Post deleted successfully",
  COMMENT_CREATED: "Comment created successfully",
  COMMENT_UPDATED: "Comment updated successfully",
  COMMENT_DELETED: "Comment deleted successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",
} as const;
