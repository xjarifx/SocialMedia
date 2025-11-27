export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithUser extends Comment {
  username: string;
  avatarUrl?: string;
}

export interface CreateCommentDTO {
  postId: number;
  userId: number;
  content: string;
}
