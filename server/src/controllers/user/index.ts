// Authentication controllers
export { handleUserRegistration, handleUserLogin } from "./auth.controller.js";

// Profile management controllers
export {
  handleUserProfileGet,
  handleProfileUpdate,
  handlePasswordChange,
} from "./profile.controller.js";

// Follow/social controllers
export {
  handleFollowUser,
  handleUnfollowUser,
  handleGetFollowers,
  handleGetFollowing,
  handleCheckFollowStatus,
} from "./follow.controller.js";

// Validation schemas (exported for potential reuse)
export {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  changePasswordSchema,
  createPostSchema,
} from "./schemas.js";
