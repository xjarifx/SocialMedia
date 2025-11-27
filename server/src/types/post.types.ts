export interface Post {
  id: number;
  userId: number;
  caption?: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithUser extends Post {
  username: string;
  avatarUrl?: string;
  likeCount: number;
  commentCount: number;
  userLiked: boolean;
}

export interface CreatePostDTO {
  userId: number;
  caption?: string;
  mediaUrl?: string;
}

export interface UpdatePostDTO {
  caption?: string;
  mediaUrl?: string;
}
