export type AuthRequestBody = {
  email: string;
  password: string;
};

export type Post = {
  caption?: string;
  media_url?: string;
  created_at: Date;
};
