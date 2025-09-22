// =============================
// USER AUTHENTICATION TYPES
// =============================

export interface RegisterRequestBody {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

// =============================
// USER DATABASE TYPES
// =============================

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isPrivate: boolean;
  status: "active" | "suspended" | "deleted";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

// =============================
// USER PROFILE TYPES
// =============================

export interface UpdateProfileRequestBody {
  username?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
}

export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// =============================
// JWT TOKEN TYPES
// =============================

export interface AuthenticatedUser {
  id: number;
  // email: string;
  // username: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}
