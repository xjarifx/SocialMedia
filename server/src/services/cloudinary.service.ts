import cloudinary from "../config/cloudinary.config.js";
import { Readable } from "stream";
import { CloudinaryUploadResult } from "../types/common.types.js";

/**
 * Upload image or video to Cloudinary with custom public_id
 * @param buffer - File buffer from multer
 * @param folder - Cloudinary folder ('posts' or 'avatars')
 * @param customPublicId - Custom public_id (e.g., '123p456')
 * @param mimeType - File mime type to determine resource type
 * @returns The custom public_id (without folder)
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  customPublicId: string,
  mimeType?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Determine resource type based on mime type
    let resourceType: "image" | "video" | "auto" = "image";
    if (mimeType?.startsWith("video/")) {
      resourceType = "video";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: customPublicId,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed - no result"));
        }
        // Return only the custom public_id (without folder)
        resolve(customPublicId);
      }
    );

    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Delete image or video from Cloudinary
 * @param publicId - Custom public_id (e.g., '123p456')
 * @param folder - Folder name ('posts' or 'avatars')
 * @param resourceType - Resource type ('image' or 'video')
 */
export const deleteFromCloudinary = async (
  publicId: string,
  folder: string,
  resourceType: "image" | "video" = "image"
): Promise<void> => {
  try {
    const fullPublicId = `${folder}/${publicId}`;
    const destroyResult = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: resourceType,
    });

    // Try to delete as video only if image deletion did not succeed and resourceType was image
    if (resourceType === "image" && destroyResult?.result !== "ok") {
      try {
        await cloudinary.uploader.destroy(fullPublicId, {
          resource_type: "video",
        });
      } catch (videoError) {
        // Ignore error if it doesn't exist as video
      }
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw error;
  }
};

/**
 * Generate custom public_id for posts
 * Format: {userId}p{postId}
 */
export const generatePostPublicId = (
  userId: number,
  postId: number
): string => {
  return `${userId}p${postId}`;
};

/**
 * Generate custom public_id for avatars
 * Format: {userId}a
 */
export const generateAvatarPublicId = (userId: number): string => {
  return `${userId}a`;
};

/**
 * Convert custom public_id to Cloudinary URL
 * @param publicId - Custom public_id from database (e.g., '123p456' or '123a')
 * @param folder - Folder name ('posts' or 'avatars')
 * @param transformations - Optional Cloudinary transformations (e.g., 'w_500,h_500,c_fill')
 * @param resourceType - Resource type ('image' or 'video')
 * @returns Full Cloudinary URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  folder: string = "posts",
  transformations: string = "",
  resourceType: "image" | "video" = "image"
): string => {
  if (!publicId) return "";

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload`;

  if (transformations) {
    return `${baseUrl}/${transformations}/${folder}/${publicId}`;
  }

  return `${baseUrl}/${folder}/${publicId}`;
};

/**
 * Add Cloudinary URLs to a single post
 * For media, we'll provide both image and video URLs since we don't store the type in DB
 * The client can determine which one to use
 */
export const addCloudinaryUrlToPost = (post: any): any => {
  const result = { ...post };

  // Add media URL if exists
  if (post.mediaUrl) {
    // Generate both image and video URLs
    const imageUrl = getCloudinaryUrl(post.mediaUrl, "posts", "", "image");
    const videoUrl = getCloudinaryUrl(post.mediaUrl, "posts", "", "video");

    // For backward compatibility, keep mediaUrl as image URL
    result.mediaUrl = imageUrl;
    // Add video URL as well
    result.mediaVideoUrl = videoUrl;
  }

  // Add avatar URL if exists
  if (post.avatarUrl) {
    // Use updatedAt timestamp as version for cache busting
    const version = post.updatedAt
      ? new Date(post.updatedAt).getTime()
      : Date.now();

    const baseUrl = getCloudinaryUrl(post.avatarUrl, "avatars");
    result.avatarUrl = `${baseUrl}?v=${version}`;
  }

  return result;
};

/**
 * Add Cloudinary URLs to multiple posts
 */
export const addCloudinaryUrlsToPosts = (posts: any[]): any[] => {
  return posts.map(addCloudinaryUrlToPost);
};

/**
 * Add Cloudinary URL to user avatar
 */
export const addCloudinaryUrlToUser = (user: any): any => {
  if (user.avatarUrl) {
    // Use updatedAt timestamp as version for cache busting
    const version = user.updatedAt
      ? new Date(user.updatedAt).getTime()
      : Date.now();

    const baseUrl = getCloudinaryUrl(user.avatarUrl, "avatars");
    return {
      ...user,
      avatarUrl: `${baseUrl}?v=${version}`,
    };
  }
  return user;
};
