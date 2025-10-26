# Like Persistence Fix

## Problem

Likes were not persisting after page refresh. When a user liked a post, the UI would update but the like would disappear after refreshing the page.

## Root Cause

1. **Frontend Issue**: The `handleLike` function in both `ProfilePage.tsx` and `UserProfilePage.tsx` only updated local state without calling the API
2. **Backend Issue**: The post queries didn't return the `isLiked` status, so the frontend always initialized posts with `isLiked: false`
3. **Missing API Integration**: No connection between the UI like action and the database

## Solution

### Backend Changes

#### 1. Updated Post Repository (`server/src/repositories/post-repository.ts`)

Added `isLiked` field to all post query functions:

**getPostsByUserId:**

- Added `currentUserId` parameter to know which user is viewing the posts
- Added SQL query to check if the current user has liked each post:

```sql
CASE WHEN $2::int IS NOT NULL THEN EXISTS(
  SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $2
) ELSE false END AS "isLiked"
```

**getForYouPosts:**

- Added `isLiked` check for the current user:

```sql
EXISTS(
  SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $1
) AS "isLiked"
```

**getFollowingPosts:**

- Same `isLiked` check implementation

#### 2. Updated Post Controller (`server/src/controllers/post-controller.ts`)

**handleGetOwnPosts:**

- Now passes `userId` twice: once for filtering posts, once for checking likes

```typescript
const posts = await getPostsByUserId(userId, userId);
```

**handleGetPostsByUsername:**

- Passes `currentUserId` to check if the viewing user has liked the posts

```typescript
const currentUserId = req.user?.id;
const posts = await getPostsByUserId(user.id, currentUserId);
```

### Frontend Changes

#### 1. ProfilePage.tsx & UserProfilePage.tsx

**Updated Data Mapping:**

- Added `isLiked` to the `ApiPost` type
- Use the `isLiked` value from the API response:

```typescript
type ApiPost = {
  id: number;
  caption?: string;
  createdAt?: string;
  created_at?: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;  // Added
};

const mapped: Post[] = postsData.map((p) => ({
  ...
  isLiked: p.isLiked ?? false,  // Use API value
  ...
}));
```

**Updated handleLike Function:**
Changed from synchronous local-only update to async API call with optimistic updates:

```typescript
// Before (only local state update)
const handleLike = (postId: number) => {
  setPosts((prev) =>
    prev.map((post) =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
        : post
    )
  );
};

// After (optimistic update + API call)
const handleLike = async (postId: number) => {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  // Optimistic update (instant UI feedback)
  setPosts((prev) =>
    prev.map((p) =>
      p.id === postId
        ? {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          }
        : p
    )
  );

  try {
    // Persist to database
    if (post.isLiked) {
      await api.unlikePost(postId);
    } else {
      await api.likePost(postId);
    }
  } catch (error) {
    // Revert on error
    console.error("Error toggling like:", error);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes + 1 : p.likes - 1,
            }
          : p
      )
    );
  }
};
```

## Benefits

1. **Data Persistence**: Likes are now saved to the database and persist across page refreshes
2. **Correct Initial State**: Posts load with the correct `isLiked` status
3. **Optimistic Updates**: UI updates immediately for better UX, then syncs with the server
4. **Error Handling**: If the API call fails, the UI reverts to the previous state
5. **Multi-user Support**: Different users see their own like states correctly

## Testing

1. Like a post on your profile or someone else's profile
2. Refresh the page
3. The like should still be there
4. Unlike the post and refresh again
5. The unlike should persist

## API Response Changes

### GET /api/posts/mine

```json
{
  "posts": [
    {
      "id": 1,
      "caption": "Hello world",
      "likeCount": 5,
      "commentCount": 2,
      "isLiked": true // ← NEW: Indicates if current user liked this post
    }
  ],
  "followerCount": 10,
  "followingCount": 25
}
```

### GET /api/posts/:username

```json
{
  "posts": [
    {
      "id": 1,
      "caption": "Hello world",
      "likeCount": 5,
      "commentCount": 2,
      "isLiked": false  // ← NEW: Current user hasn't liked this
    }
  ],
  "user": { ... }
}
```

## Files Modified

- `server/src/repositories/post-repository.ts`
- `server/src/controllers/post-controller.ts`
- `client/src/pages/profile/ProfilePage.tsx`
- `client/src/pages/profile/UserProfilePage.tsx`
