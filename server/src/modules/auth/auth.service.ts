import {
  checkEmailExists,
  checkUsernameExists,
  insertUser,
  getUserByEmail,
} from "./auth.repository.js";
import {
  hashPassword,
  comparePassword,
} from "../../shared/utils/crypto.util.js";
import { generateToken } from "../../shared/utils/jwt.util.js";
import { PublicUser, CreateUserDTO } from "../../types/user.types.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.js";

export class AuthService {
  async register(
    data: CreateUserDTO
  ): Promise<{ user: PublicUser; token: string }> {
    const { email, username, password } = data;

    // Check if email exists
    if (await checkEmailExists(email)) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Check if username exists
    if (await checkUsernameExists(username)) {
      throw new Error(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const userInsertResult = await insertUser(email, username, hashedPassword);
    const newUser = userInsertResult.rows[0];

    // Generate token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatarUrl: newUser.avatarUrl,
        bio: newUser.bio,
        phone: newUser.phone,
        isPrivate: newUser.isPrivate,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      token,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: PublicUser; token: string }> {
    // Get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        phone: user.phone,
        isPrivate: user.isPrivate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }
}
