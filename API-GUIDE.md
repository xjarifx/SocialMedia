# 🚀 Social Media API Guide

A comprehensive guide for the frontend team to integrate with our awesome social media API!

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Posts](#posts)
5. [Comments](#comments)
6. [Likes](#likes)
7. [Social Features](#social-features)
8. [Search](#search)
9. [Error Handling](#error-handling)
10. [Common Patterns](#common-patterns)

## 🎯 Getting Started

### Base URL

```
http://localhost:3000/api
```

### Headers

For authenticated requests, include:

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Response Format

All responses follow this structure:

```json
{
  "message": "Success/Error message",
  "data": {}, // Optional: response data
  "user": {}, // Optional: user data
  "token": "jwt_token" // Optional: for login/register
}
```

## 🔐 Authentication

### Register User

**POST** `/register`

Create a new user account.

```javascript
// Request
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}

// Response (201)
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-09-29T12:00:00Z",
    "updatedAt": "2025-09-29T12:00:00Z"
  }
}
```

**Validation Rules:**

- ✅ Email: Valid email format
- ✅ Username: 3-50 characters, letters/numbers/underscores only
- ✅ Password: Min 8 chars, uppercase, lowercase, number, special character

### Login User

**POST** `/login`

Authenticate user and get JWT token.

```javascript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response (200)
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-09-29T12:00:00Z",
    "updatedAt": "2025-09-29T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**🔒 Store the JWT token** - it expires in 24 hours!

## 👤 User Management

### Get Profile

**GET** `/profile` 🔐

Get current user's profile information.

```javascript
// Response (200)
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "bio": "Software developer",
    "avatarUrl": "https://example.com/avatar.jpg",
    "isVerified": false,
    "isPrivate": false,
    "status": "active",
    "createdAt": "2025-09-29T12:00:00Z",
    "updatedAt": "2025-09-29T12:00:00Z"
  }
}
```

### Update Profile

**PUT** `/profile` 🔐

Update current user's profile. All fields are optional.

```javascript
// Request
{
  "username": "newusername",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "isPrivate": true
}

// Response (200)
{
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
  }
}
```

**Validation:**

- Username: 3-50 chars, unique
- Phone: Valid format, unique
- Bio: Max 500 chars
- Avatar URL: Max 500 chars
- isPrivate: Boolean

### Change Password

**PUT** `/password` 🔐

Change user's password.

```javascript
// Request
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}

// Response (200)
{
  "message": "Password changed successfully"
}
```

## 📝 Posts

### Create Post

**POST** `/posts` 🔐

Create a new post with optional caption and media.

```javascript
// Request
{
  "caption": "Check out this awesome post!",
  "mediaUrl": "https://example.com/image.jpg"
}

// Response (201)
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "userId": 1,
    "caption": "Check out this awesome post!",
    "mediaUrl": "https://example.com/image.jpg",
    "createdAt": "2025-09-29T12:00:00Z",
    "updatedAt": "2025-09-29T12:00:00Z"
  }
}
```

**📌 Note:** Either caption OR mediaUrl is required (or both).

### Update Post

**PUT** `/:postId` 🔐

Update an existing post. Only the post owner can update.

```javascript
// Request
{
  "caption": "Updated caption!",
  "mediaUrl": "https://example.com/new-image.jpg"
}

// Response (200)
{
  "message": "Post updated successfully",
  "post": {
    // Updated post object
  }
}
```

### Delete Post

**DELETE** `/:postId` 🔐

Delete a post. Only the post owner can delete.

```javascript
// Response (204)
// No content - successful deletion
```

## 💬 Comments

### Get Comments for Post

**GET** `/:postId/comments` 🔐

Retrieve all comments for a specific post.

```javascript
// Response (200)
{
  "comments": [
    {
      "id": 1,
      "postId": 1,
      "userId": 2,
      "comment": "Great post!",
      "createdAt": "2025-09-29T12:00:00Z",
      "username": "commenter"
    }
  ]
}
```

### Create Comment

**POST** `/:postId/comments` 🔐

Add a comment to a post.

```javascript
// Request
{
  "comment": "This is an awesome post!"
}

// Response (201)
{
  "message": "Comment created successfully",
  "comment": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "comment": "This is an awesome post!",
    "createdAt": "2025-09-29T12:00:00Z"
  }
}
```

### Update Comment

**PUT** `/:commentId` 🔐

Update your own comment.

```javascript
// Request
{
  "comment": "Updated comment text"
}

// Response (200)
{
  "message": "Comment updated successfully",
  "comment": {
    // Updated comment object
  }
}
```

### Delete Comment

**DELETE** `/:commentId` 🔐

Delete your own comment.

```javascript
// Response (200)
{
  "message": "Comment deleted successfully"
}
```

## ❤️ Likes

### Like a Post

**POST** `/:postId/likes` 🔐

Add a like to a post.

```javascript
// Response (201)
{
  "message": "Like created successfully",
  "like": {
    "id": 1,
    "userId": 1,
    "postId": 1,
    "createdAt": "2025-09-29T12:00:00Z"
  }
}
```

### Get Like Count

**GET** `/:postId/likes` 🔐

Get the total number of likes for a post.

```javascript
// Response (200)
{
  "postId": 1,
  "likeCount": 25
}
```

### Unlike a Post

**DELETE** `/:postId/likes` 🔐

Remove your like from a post.

```javascript
// Response (204)
{
  "message": "Like deleted successfully"
}
```

## 👥 Social Features

### Follow User

**POST** `/:targetUsername/follow` 🔐

Follow another user by their username.

```javascript
// Response (200)
{
  "message": "Successfully followed the user"
}
```

### Unfollow User

**DELETE** `/:targetUsername/unfollow` 🔐

Unfollow a user by their username.

```javascript
// Response (200)
{
  "message": "Successfully unfollowed the user"
}
```

### Get Followers

**GET** `/followers` 🔐

Get list of users following you.

```javascript
// Response (200)
[
  {
    id: 2,
    username: "follower1",
    bio: "User bio",
    avatarUrl: "https://example.com/avatar.jpg",
    followedAt: "2025-09-29T12:00:00Z",
  },
];
```

### Get Following

**GET** `/following` 🔐

Get list of users you are following.

```javascript
// Response (200)
[
  {
    id: 3,
    username: "following1",
    bio: "User bio",
    avatarUrl: "https://example.com/avatar.jpg",
    followedAt: "2025-09-29T12:00:00Z",
  },
];
```

## 🔍 Search

### Search Users

**GET** `/search?username={query}`

Search for users by username (public endpoint).

```javascript
// Request: GET /search?username=john

// Response (200)
{
  "users": [
    {
      "id": 1,
      "username": "johndoe",
      "fullName": "John Doe",
      "bio": "Software developer",
      "createdAt": "2025-09-29T12:00:00Z"
    }
  ]
}
```

**Features:**

- ✨ Fuzzy search (partial matches)
- ✨ Multiple word support
- ✨ Case insensitive
- ✨ Results sorted by username length
- ✨ Limited to 50 results

## ⚠️ Error Handling

### Common HTTP Status Codes

| Code | Meaning               | Description                            |
| ---- | --------------------- | -------------------------------------- |
| 200  | OK                    | Request successful                     |
| 201  | Created               | Resource created successfully          |
| 204  | No Content            | Successful deletion                    |
| 400  | Bad Request           | Invalid request data                   |
| 401  | Unauthorized          | Missing or invalid token               |
| 403  | Forbidden             | No permission to access                |
| 404  | Not Found             | Resource not found                     |
| 409  | Conflict              | Duplicate data (email/username exists) |
| 500  | Internal Server Error | Server error                           |

### Error Response Format

```javascript
{
  "message": "Descriptive error message"
}
```

### Common Validation Errors

**Registration/Login:**

```javascript
// Missing fields
{ "message": "Please provide email, username, and password" }

// Invalid email
{ "message": "Invalid email format" }

// Weak password
{ "message": "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" }

// Duplicate data
{ "message": "Email already exists" }
{ "message": "Username already exists" }
```

## 🛠️ Common Patterns

### Frontend Implementation Examples

#### 1. Authentication Flow

```javascript
// Login function
async function login(email, password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage/cookies
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}
```

#### 2. Authenticated Requests

```javascript
// Helper function for authenticated requests
async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("authToken");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };

  const response = await fetch(`/api${url}`, config);

  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  return response;
}

// Usage example
const response = await authenticatedFetch("/posts", {
  method: "POST",
  body: JSON.stringify({ caption: "New post!" }),
});
```

#### 3. Error Handling with User Feedback

```javascript
async function createPost(postData) {
  try {
    const response = await authenticatedFetch("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      showSuccessMessage("Post created successfully!");
      return data.post;
    } else {
      showErrorMessage(data.message);
    }
  } catch (error) {
    showErrorMessage("Failed to create post. Please try again.");
    console.error(error);
  }
}
```

#### 4. Real-time Like Counter

```javascript
async function toggleLike(postId, isLiked) {
  try {
    const method = isLiked ? "DELETE" : "POST";
    const response = await authenticatedFetch(`/${postId}/likes`, { method });

    if (response.ok) {
      // Update UI optimistically
      const likeCountResponse = await authenticatedFetch(`/${postId}/likes`);
      const { likeCount } = await likeCountResponse.json();
      updateLikeUI(postId, likeCount, !isLiked);
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
  }
}
```

## 🎉 Quick Start Checklist

- [ ] Set up base URL and headers
- [ ] Implement authentication flow
- [ ] Create error handling utilities
- [ ] Build authenticated fetch helper
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Implement real-time features
- [ ] Add loading states and user feedback
- [ ] Handle token expiration

## 💡 Pro Tips

1. **Token Management**: Always check for token expiration and handle 401 responses
2. **Optimistic Updates**: Update UI immediately for likes/follows, rollback on error
3. **Validation**: Validate on frontend before sending requests to reduce server load
4. **Caching**: Cache user profiles and posts to improve performance
5. **Error Messages**: Show user-friendly error messages, log technical details
6. **Loading States**: Always show loading indicators for async operations

---

**🚀 Happy coding! Your social media app is going to be amazing!**

For questions or issues, check the server logs or contact the backend team.
