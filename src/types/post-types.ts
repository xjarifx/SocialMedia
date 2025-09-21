// =============================
// POST TYPES
// =============================

export interface Post {
  id: number;
  userId: number;
  content: string; // matches database schema
  mediaUrl?: string; // matches database schema
  createdAt: Date;
  updatedAt: Date; // matches database schema
}

export interface CreatePostRequestBody {
  content: string; // required, matches database
  mediaUrl?: string;
}

export interface UpdatePostRequestBody {
  content?: string;
  mediaUrl?: string;
}

export interface PostWithUser extends Post {
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
}
