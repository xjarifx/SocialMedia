import multer from "multer";
import path from "path";
import sanitize from "sanitize-filename";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

const avatarFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const sanitizedFilename = sanitize(file.originalname);
  if (sanitizedFilename !== file.originalname) {
    return cb(new Error("Invalid characters in filename"));
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPEG, PNG, and WebP images are allowed for avatars")
    );
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}`));
  }

  cb(null, true);
};

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 1,
  },
});

export const handleAvatarUploadError = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Avatar too large (max 5MB)" });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};
