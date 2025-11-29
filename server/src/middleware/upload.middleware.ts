import multer from "multer";
import type { Request } from "express";
import path from "path";
import sanitize from "sanitize-filename";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

  // Validate and sanitize filename
  const sanitizedFilename = sanitize(file.originalname);
  if (sanitizedFilename !== file.originalname) {
    return cb(new Error("Invalid characters in filename"));
  }

  // Check filename length
  if (file.originalname.length > 255) {
    return cb(new Error("Filename too long (max 255 characters)"));
  }

  // Check MIME type strictly
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type: ${file.mimetype}`));
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}`));
  }

  // Ensure MIME type matches extension
  const mimeExtensionMap: Record<string, string[]> = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "video/mp4": [".mp4"],
    "video/webm": [".webm"],
  };

  const validExtensions = mimeExtensionMap[file.mimetype] || [];
  if (!validExtensions.includes(ext)) {
    return cb(new Error("File extension does not match MIME type"));
  }

  cb(null, true);
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

// Error handler for multer
export const handleMulterError = (
  err: any,
  req: Request,
  res: any,
  next: any
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large (max 10MB)" });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};
