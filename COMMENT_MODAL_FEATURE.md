# Comment Modal Feature

## Overview

Added a floating comment modal that allows users to view existing comments and add new comments to posts.

## Changes Made

### 1. New Component: `CommentModal.tsx`

**Location:** `client/src/components/posts/CommentModal.tsx`

**Features:**

- Floating modal that appears when clicking the comment button
- Displays the original post at the top
- Comment input field with character counter (280 chars max)
- Real-time character limit indicator with color coding:
  - Primary blue: Normal usage
  - Orange: Less than 20 characters remaining
  - Red: Over limit
- List of existing comments below the input
- Auto-expanding textarea
- Auto-focus on textarea when modal opens
- Loading state while fetching comments
- Empty state message when no comments exist
- Smooth animations using Framer Motion
- Click outside to close
- Success/error toast notifications

### 2. Updated Components

#### `PostCard.tsx`

- Added `CommentModal` import and integration
- Added `showCommentModal` state
- Added `handleCommentClick` function to open modal
- Added `handleCommentAdded` callback to update comment count
- Added `onCommentAdded` prop to support parent updates
- Comment button now opens the modal instead of doing nothing

#### `PostFeed.tsx`

- Added `handleCommentAdded` function to increment comment count
- Passes `onCommentAdded` callback to `PostCard` components
- Updates post comment count in real-time when new comments are added

### 3. Backend Updates

#### `comment-repository.ts`

**Updated `getCommentsByPostId`:**

- Now joins with `users` table to include username
- Orders comments by creation date (newest first)
- Uses double-quoted aliases for proper camelCase in PostgreSQL
- Returns username along with comment data

**Updated `insertComment`:**

- Fetches username after inserting comment
- Returns username in the response
- Simplified to only set `created_at` (removed `updated_at` on insert)

### 4. User Experience Flow

1. **Opening Comments:**

   - User clicks comment button on a post
   - Modal slides up with fade animation
   - Modal shows original post at top
   - Comment input is auto-focused
   - Existing comments load below

2. **Adding a Comment:**

   - User types in the comment field
   - Character counter updates in real-time
   - Textarea auto-expands as content grows
   - Click "Reply" button to submit
   - Success toast appears: "Comment added successfully"
   - New comment appears at top of list
   - Comment count on post increments
   - Input field clears

3. **Viewing Comments:**

   - Comments display with user avatar (generated from first letter)
   - Shows username and relative time
   - Comments are ordered newest first
   - Scrollable list if many comments

4. **Closing Modal:**
   - Click X button
   - Click outside modal
   - Smooth fade-out animation

## Visual Design

### Comment Modal

- **Size:** Max width 2xl (672px)
- **Position:** Centered, starts 20vh from top
- **Background:** Black with neutral-800 border
- **Sections:**
  1. Header (sticky) - Title and close button
  2. Original Post - Shows post author and content
  3. Comment Input - User avatar, textarea, counter, reply button
  4. Comments List - Scrollable, max height 400px

### Comment Input

- Auto-expanding textarea
- Circular character counter (appears after typing)
- Color-coded progress indicator
- Disabled state when over limit or empty

### Comment Items

- User avatar (gradient circle with initial)
- Username in bold
- Relative timestamp
- Comment text with whitespace preserved
- Hover effect on background

## API Integration

### Endpoints Used

1. **GET** `/{postId}/comments` - Fetch all comments for a post
2. **POST** `/{postId}/comments` - Create a new comment

### Request/Response

**Create Comment:**

```typescript
// Request
POST /{postId}/comments
{ "comment": "Great post!" }

// Response
{
  "message": "Comment created successfully",
  "comment": {
    "id": 123,
    "userId": 456,
    "username": "johndoe",
    "postId": 789,
    "comment": "Great post!",
    "createdAt": "2025-10-18T..."
  }
}
```

**Get Comments:**

```typescript
// Request
GET /{postId}/comments

// Response
{
  "comments": [
    {
      "id": 123,
      "userId": 456,
      "username": "johndoe",
      "postId": 789,
      "comment": "Great post!",
      "createdAt": "2025-10-18T...",
      "updatedAt": "2025-10-18T..."
    }
  ]
}
```

## Technical Details

### State Management

- Local state for comments list
- Optimistic UI updates (comment appears immediately)
- Parent component updates for comment count
- Loading states for async operations

### Performance

- Comments load only when modal opens
- Auto-expanding textarea for better UX
- Efficient re-renders with proper keys
- Smooth animations without blocking

### Accessibility

- Focus management (auto-focus textarea)
- Keyboard navigation support
- Clear visual feedback
- Proper ARIA labels on buttons

## Future Enhancements

Potential improvements:

- Edit/delete own comments
- Like comments
- Reply to comments (nested threads)
- Mention other users (@username)
- Real-time updates (WebSocket)
- Pagination for large comment lists
- Comment sorting options
- Rich text formatting
- Image attachments in comments
- Report inappropriate comments

## Testing Checklist

- [x] Modal opens when clicking comment button
- [x] Comments load when modal opens
- [x] Can add new comment
- [x] Character counter works correctly
- [x] Submit button disabled when over limit
- [x] New comment appears in list
- [x] Comment count increments on post
- [x] Toast notifications show on success/error
- [x] Modal closes on backdrop click
- [x] Modal closes on X button click
- [x] Textarea auto-expands
- [x] Empty state shows when no comments
- [x] Loading state shows while fetching
- [x] Smooth animations work correctly
- [x] Username displays correctly
- [x] Timestamps format correctly

## Known Issues

None currently identified.
