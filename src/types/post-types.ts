export interface Post {
  id: number;
  userId: number;
  caption?: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequestBody {
  caption?: string;
  mediaUrl?: string;
}

export interface UpdatePostRequestBody {
  caption?: string;
  mediaUrl?: string;
}
