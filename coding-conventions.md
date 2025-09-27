# Project Naming Conventions

This document outlines the naming conventions for our Node.js/Express backend project with raw SQL database layer. Following these conventions ensures code consistency, readability, and maintainability across the entire codebase.

## 1. General Rules

### Core Principles

- **Descriptive over Generic**: Use `userList` instead of `data`, `createUserError` instead of `error`
- **Consistency**: Same entity should have consistent naming across all layers
- **Clarity**: Names should be self-documenting and unambiguous
- **No Abbreviations**: Avoid abbreviations except universally recognized ones (`id`, `url`, `api`)

### Case Conventions

- **camelCase**: Variables, parameters, functions, methods
- **PascalCase**: Classes, interfaces, types, components
- **kebab-case**: File names, folder names
- **snake_case**: Database tables, columns, environment variables

## 2. File & Folder Naming

### Folder Structure

```
src/
├── controllers/          # HTTP request handlers
├── services/            # Business logic layer
├── repositories/        # Database access layer
├── middlewares/         # Express middlewares
├── routes/             # Route definitions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── config/             # Configuration files
├── db/                 # Database connection & migrations
└── tests/              # Test files (mirrors src structure)
```

### File Naming Rules

- **Lowercase, kebab-case**: `user-controller.ts`, `post-service.ts`
- **Resource-specific**: `user-repository.ts` not `repository.ts`
- **One responsibility per file**: One controller, service, or repository per file
- **Test files**: Mirror source structure with `.test.ts` suffix

### Examples

```
✅ Good                           ❌ Bad
controllers/user-controller.ts    controllers/userController.ts
services/post-service.ts          services/postService.ts
repositories/user-repository.ts   repositories/repository.ts
middlewares/auth-middleware.ts    middlewares/middleware.ts
utils/hash-password.ts            utils/utils.ts
tests/user-service.test.ts        tests/userServiceTest.ts
```

## 3. Function & Variable Naming

### Functions

- **Verb-first naming**: Action should be clear from the name
- **Descriptive parameters**: No generic parameter names
- **Return type consistency**: Boolean functions start with `is`, `has`, `should`

```typescript
✅ Good
function createUser(email: string, username: string): Promise<User>
function getUserById(userId: number): Promise<User | null>
function deletePostById(postId: number, userId: number): Promise<void>
function isEmailExists(email: string): Promise<boolean>
function hasPermission(userId: number, resource: string): boolean

❌ Bad
function create(data: any): Promise<any>
function get(id: number): Promise<any>
function delete(id: number): Promise<void>
function check(email: string): Promise<boolean>
function permission(user: number, res: string): boolean
```

### Variables

```typescript
✅ Good
const userId = req.user?.id;
const postCreationError = new Error('Failed to create post');
const isValidEmail = validateEmail(email);
const authenticationToken = generateToken(user);

❌ Bad
const id = req.user?.id;
const error = new Error('Failed to create post');
const valid = validateEmail(email);
const token = generateToken(user);
```

### Error Handling

```typescript
✅ Good
try {
  const result = await createUser(email, username, password);
} catch (userCreationError) {
  console.error('User creation failed:', userCreationError);
  return res.status(500).json({ message: 'Internal server error' });
}

❌ Bad
try {
  const result = await createUser(email, username, password);
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ message: 'Error' });
}
```

## 4. Database Naming

### Tables

- **Plural, snake_case**: `users`, `posts`, `user_posts`, `post_comments`
- **Descriptive**: Table name should clearly indicate what it stores

### Columns

- **snake_case**: `created_at`, `updated_at`, `first_name`, `last_name`
- **Foreign keys**: `<table_singular>_id` format (`user_id`, `post_id`)
- **Boolean flags**: `is_active`, `has_permission`, `should_notify`

### SQL Queries with Aliasing

Always alias snake_case database columns to camelCase when returning results:

```typescript
✅ Good
export const getUserById = async (userId: number) => {
  const result = await connectionPool.query(
    `SELECT
       id,
       email,
       username,
       first_name AS firstName,
       last_name AS lastName,
       created_at AS createdAt,
       updated_at AS updatedAt
     FROM users
     WHERE id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

export const createPost = async (userId: number, title: string, content: string) => {
  return connectionPool.query(
    `INSERT INTO posts (user_id, title, content, created_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id AS userId, title, content, created_at AS createdAt`,
    [userId, title, content, new Date()]
  );
};

❌ Bad
export const getUser = async (id: number) => {
  const result = await connectionPool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};
```

## 5. Imports & Exports

### Consistent Naming Across Modules

```typescript
✅ Good
// user-repository.ts
export const createUser = async (email: string, username: string) => { ... };
export const getUserByEmail = async (email: string) => { ... };

// user-service.ts
import { createUser, getUserByEmail } from '../repositories/user-repository.js';

// user-controller.ts
import { registerUser, authenticateUser } from '../services/user-service.js';
```

### Conflict Resolution

When naming conflicts occur, use descriptive prefixes/suffixes:

```typescript
✅ Good
// user-repository.ts
export const insertUser = async (...) => { ... };

// user-service.ts
export const createUser = async (...) => { ... };

// post-repository.ts
export const insertPost = async (...) => { ... };

// post-service.ts
export const createPost = async (...) => { ... };
```

## 6. TypeScript Types & Interfaces

### Interface Naming

```typescript
✅ Good
interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

interface CreateUserRequestBody {
  email: string;
  username: string;
  password: string;
}

interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}

❌ Bad
interface UserData {
  id: number;
  email: string;
  username: string;
  created_at: Date;
}

interface RequestBody {
  email: string;
  username: string;
  password: string;
}
```

## 7. Complete Feature Example

Here's how a complete "user" feature should be structured:

### File Structure

```
src/
├── controllers/
│   └── user-controller.ts       # HTTP handlers for user endpoints
├── services/
│   └── user-service.ts          # Business logic for user operations
├── repositories/
│   └── user-repository.ts       # Database queries for users
├── routes/
│   └── user-routes.ts           # Route definitions for /users/*
├── middlewares/
│   └── auth-middleware.ts       # Authentication middleware
├── types/
│   └── user-types.ts            # User-related type definitions
└── tests/
    ├── user-controller.test.ts
    ├── user-service.test.ts
    └── user-repository.test.ts
```

### Code Examples

#### user-types.ts

```typescript
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequestBody {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}
```

#### user-repository.ts

```typescript
import connectionPool from "../db/connection.js";
import bcrypt from "bcrypt";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const result = await connectionPool.query(
    "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return (result.rowCount ?? 0) > 0;
};

export const insertUser = async (
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return connectionPool.query(
    `INSERT INTO users (email, username, first_name, last_name, password, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, email, username, first_name AS firstName, last_name AS lastName, created_at AS createdAt`,
    [email, username, firstName, lastName, hashedPassword, new Date()]
  );
};

export const getUserByEmail = async (email: string) => {
  const result = await connectionPool.query(
    `SELECT id, email, username, first_name AS firstName, last_name AS lastName, 
            password, created_at AS createdAt, updated_at AS updatedAt 
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};
```

#### user-service.ts

```typescript
import {
  checkEmailExists,
  insertUser,
  getUserByEmail,
} from "../repositories/user-repository.js";
import { CreateUserRequestBody } from "../types/user-types.js";
import jwt from "jsonwebtoken";

export const createUser = async (userData: CreateUserRequestBody) => {
  const { email, username, firstName, lastName, password } = userData;

  if (await checkEmailExists(email)) {
    throw new Error("Email already exists");
  }

  const result = await insertUser(
    email,
    username,
    firstName,
    lastName,
    password
  );
  return result.rows[0];
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { user, accessToken };
};
```

#### user-controller.ts

```typescript
import { Request, Response } from "express";
import { createUser, authenticateUser } from "../services/user-service.js";
import { CreateUserRequestBody } from "../types/user-types.js";

export const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const userData = req.body as CreateUserRequestBody;
    const newUser = await createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (userRegistrationError) {
    console.error("User registration failed:", userRegistrationError);
    res.status(400).json({
      message: userRegistrationError.message,
    });
  }
};

export const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authenticateUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (userLoginError) {
    console.error("User login failed:", userLoginError);
    res.status(401).json({
      message: userLoginError.message,
    });
  }
};
```

## 8. Common Mistakes to Avoid

### ❌ Generic Names

```typescript
// Bad
const data = await getUsers();
const info = await getUserInfo();
const list = await getPostList();
const result = await createPost();

// Good
const userList = await getUsers();
const userProfile = await getUserProfile();
const postCollection = await getPosts();
const createdPost = await createPost();
```

### ❌ Ambiguous Functions

```typescript
// Bad
function create(data: any): Promise<any>
function update(id: number, data: any): Promise<any>
function delete(id: number): Promise<void>

// Good
function createUser(userData: CreateUserRequestBody): Promise<User>
function updateUserProfile(userId: number, profileData: UpdateProfileRequestBody): Promise<User>
function deleteUserById(userId: number): Promise<void>
```

### ❌ Inconsistent Naming Across Layers

```typescript
// Bad - Different names for same concept
// Repository
export const insertUser = async (...) => { ... };

// Service
export const createUser = async (...) => { ... };

// Controller
export const registerUser = async (...) => { ... };

// Good - Consistent concept, layer-appropriate verbs
// Repository
export const insertUser = async (...) => { ... };

// Service
export const createUser = async (...) => { ... };

// Controller
export const handleUserCreation = async (...) => { ... };
```

## 9. Checklist for New Features

When implementing a new feature, ensure:

- [ ] Folder structure follows kebab-case convention
- [ ] File names are descriptive and kebab-case
- [ ] Functions use verb-first naming
- [ ] Variables use camelCase and are descriptive
- [ ] Database tables/columns use snake_case
- [ ] SQL results are aliased to camelCase
- [ ] TypeScript interfaces use PascalCase
- [ ] Error variables end with "Error"
- [ ] Boolean variables start with is/has/should
- [ ] No generic names (data, info, list, etc.)
- [ ] Imports/exports are consistent across modules
- [ ] Test files mirror source structure

## 10. Migration Guide

When refactoring existing code to follow these conventions:

1. **Start with types**: Update interfaces and type definitions first
2. **Update database queries**: Add proper aliasing for camelCase conversion
3. **Rename files**: Use kebab-case for all files
4. **Update imports**: Fix all import statements after renaming
5. **Refactor functions**: Apply verb-first naming consistently
6. **Update variables**: Ensure descriptive, camelCase naming
7. **Test thoroughly**: Verify all functionality after renaming

Following these conventions will ensure a maintainable, readable, and professional codebase that new developers can easily understand and contribute to.
