export interface SignupRequestBody {
  email: string;
  username: string;
  password: string;
}

export interface SigninRequestBody {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface Post {
  id: number;
  userId: number;
  caption?: string;
  mediaUrl?: string;
  createdAt: Date;
}

export interface CreatePostRequestBody {
  caption?: string;
  mediaUrl?: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}
