# Comment Load Error Fix

## Issue

Getting 500 Internal Server Error when loading comments:

```
GET http://localhost:3000/api/100/comments 500 (Internal Server Error)
Error loading comments: ApiError: Failed to retrieve comments
```

## Root Cause

The `getCommentsByPostId` function was trying to select the `updated_at` column from the `comments` table, but according to the database schema, the `comments` table only has a `created_at` column, not an `updated_at` column.

## Database Schema

```sql
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Note: No `updated_at` column exists.

## Fix Applied

### `comment-repository.ts`

**1. Fixed `getCommentsByPostId` function:**

- Removed `updated_at` from the SELECT query
- Removed `updatedAt` from the TypeScript return type
- Query now only selects: `id`, `userId`, `username`, `postId`, `comment`, `createdAt`

**Before:**

```typescript
SELECT c.id, c.user_id AS "userId", u.username, c.post_id AS "postId",
       c.comment, c.created_at AS "createdAt", c.updated_at AS "updatedAt"
FROM comments c
INNER JOIN users u ON u.id = c.user_id
WHERE c.post_id = $1
ORDER BY c.created_at DESC
```

**After:**

```typescript
SELECT c.id, c.user_id AS "userId", u.username, c.post_id AS "postId",
       c.comment, c.created_at AS "createdAt"
FROM comments c
INNER JOIN users u ON u.id = c.user_id
WHERE c.post_id = $1
ORDER BY c.created_at DESC
```

**2. Fixed `updateComment` function:**

- Removed `updated_at` column from UPDATE statement
- Removed `updatedAt` from the TypeScript return type
- Removed the `new Date()` parameter that was setting `updated_at`

**Before:**

```typescript
UPDATE comments SET comment = $1, updated_at = $2
WHERE id = $3
RETURNING id, user_id AS "userId", post_id AS "postId",
          comment, created_at AS "createdAt", updated_at AS "updatedAt"
```

**After:**

```typescript
UPDATE comments SET comment = $1
WHERE id = $2
RETURNING id, user_id AS "userId", post_id AS "postId",
          comment, created_at AS "createdAt"
```

## Frontend Compatibility

The `CommentModal.tsx` component already has the correct interface without `updatedAt`, so no frontend changes were needed:

```typescript
interface Comment {
  id: number;
  userId: number;
  username: string;
  comment: string;
  createdAt: string;
}
```

## Testing

After this fix:

- ✅ Comments should load without errors
- ✅ Comment creation works (already working)
- ✅ Comment updates work (if implemented)
- ✅ No SQL errors in the server logs

## Note

If you want to track when comments are updated, you would need to add an `updated_at` column to the database:

```sql
ALTER TABLE comments ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
```

But currently, the schema doesn't include this field, so we've aligned the code with the actual database structure.
