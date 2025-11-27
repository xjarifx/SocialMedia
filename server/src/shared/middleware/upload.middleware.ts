import multer from "multer";
import type { Request } from "express";
import path from "path";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".webm",
  ];

  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"));
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Invalid file extension"));
  }

  cb(null, true);
};

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 10, // Maximum 10 files per request
  },
});
