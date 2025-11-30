import rateLimit from "express-rate-limit";

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error:
      "Too many authentication attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  // Skip rate limiting in test environment
  skip: (req) => process.env.NODE_ENV === "test",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error:
        "Too many authentication attempts, please try again after 15 minutes",
    });
  },
});

// Standard rate limiting for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: "Too many requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many requests, please try again after 15 minutes",
    });
  },
});

// Stricter rate limiting for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per window
  message: {
    success: false,
    error: "Too many upload requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many upload requests, please try again later",
    });
  },
});

// Rate limiting for search endpoints (public endpoints)
export const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 searches per window
  message: {
    success: false,
    error: "Too many search requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many search requests, please try again later",
    });
  },
});
