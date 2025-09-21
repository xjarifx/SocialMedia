// =============================
// GLOBAL TYPE AUGMENTATIONS
// =============================

import { AuthenticatedUser } from "./user-types.js";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// This file needs to be a module to work with declare global
export {};
