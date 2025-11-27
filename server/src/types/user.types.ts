export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isPrivate: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface PublicUser {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserDTO {
  bio?: string;
  phone?: string;
  isPrivate?: boolean;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
