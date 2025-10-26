# Follower Count Fix

## Problem

The follower and following counts were resetting to 0 after page refresh on both the user's own profile page and other users' profile pages.

## Root Cause

1. **ProfilePage.tsx** (own profile): The follower and following counts were hardcoded to `0` using `useState(0)` without ever fetching actual data from the backend.
2. **UserProfilePage.tsx** (other users' profiles): The counts were only updated when following/unfollowing, but initial counts were never fetched on page load.
3. The backend API endpoints (`/posts/mine` and `/posts/:username`) did not return follower/following counts in their responses.

## Solution

### Backend Changes

#### 1. Added Count Functions to User Repository

**File**: `server/src/repositories/user-repository.ts`

Added two new functions to query follower and following counts:

```typescript
export const getFollowerCount = async (userId: number): Promise<number> => {
  const result = await connectionPool.query(
    "SELECT COUNT(*) as count FROM follows WHERE following_id = $1",
    [userId]
  );
  return parseInt(result.rows[0]?.count || "0", 10);
};

export const getFollowingCount = async (userId: number): Promise<number> => {
  const result = await connectionPool.query(
    "SELECT COUNT(*) as count FROM follows WHERE follower_id = $1",
    [userId]
  );
  return parseInt(result.rows[0]?.count || "0", 10);
};
```

#### 2. Updated Post Controller

**File**: `server/src/controllers/post-controller.ts`

- Imported the new count functions
- Modified `handleGetOwnPosts` to include follower/following counts in the response
- Modified `handleGetPostsByUsername` to include counts in the user object

### Frontend Changes

#### 1. ProfilePage.tsx (Own Profile)

**File**: `client/src/pages/profile/ProfilePage.tsx`

- Changed from `const [followerCount] = useState(0)` to `const [followerCount, setFollowerCount] = useState(0)`
- Changed from `const [followingCount] = useState(0)` to `const [followingCount, setFollowingCount] = useState(0)`
- Added logic to extract and set counts from API response:

```typescript
if (typeof data.followerCount === "number") {
  setFollowerCount(data.followerCount);
}
if (typeof data.followingCount === "number") {
  setFollowingCount(data.followingCount);
}
```

#### 2. UserProfilePage.tsx (Other Users' Profiles)

**File**: `client/src/pages/profile/UserProfilePage.tsx`

- Changed from `const [followingCount] = useState(0)` to `const [followingCount, setFollowingCount] = useState(0)`
- Added logic to extract counts from the user object in API response:

```typescript
if (typeof data.user.followerCount === "number") {
  setFollowerCount(data.user.followerCount);
}
if (typeof data.user.followingCount === "number") {
  setFollowingCount(data.user.followingCount);
}
```

## API Response Changes

### GET /api/posts/mine

**Before:**

```json
{
  "posts": [...]
}
```

**After:**

```json
{
  "posts": [...],
  "followerCount": 10,
  "followingCount": 25
}
```

### GET /api/posts/:username

**Before:**

```json
{
  "posts": [...],
  "user": {
    "id": 1,
    "username": "john",
    ...
  }
}
```

**After:**

```json
{
  "posts": [...],
  "user": {
    "id": 1,
    "username": "john",
    "followerCount": 10,
    "followingCount": 25,
    ...
  }
}
```

## Testing

1. Start the backend server: `npm run dev` in the `server` directory
2. Start the frontend: `npm run dev` in the `client` directory
3. Login to the application
4. Navigate to your profile page - follower/following counts should display correctly
5. Refresh the page - counts should persist
6. Visit another user's profile - their counts should display correctly
7. Follow/unfollow a user - the count should update and persist after refresh

## Files Modified

- `server/src/repositories/user-repository.ts`
- `server/src/controllers/post-controller.ts`
- `client/src/pages/profile/ProfilePage.tsx`
- `client/src/pages/profile/UserProfilePage.tsx`
