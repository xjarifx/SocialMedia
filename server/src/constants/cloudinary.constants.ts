export const CLOUDINARY_FOLDERS = {
  POSTS: "posts",
  AVATARS: "avatars",
} as const;

export const CLOUDINARY_RESOURCE_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  AUTO: "auto",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
export type CloudinaryResourceType =
  (typeof CLOUDINARY_RESOURCE_TYPES)[keyof typeof CLOUDINARY_RESOURCE_TYPES];
