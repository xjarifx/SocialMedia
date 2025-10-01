# 🚀 Social Media API - Baby Guide

**Base URL:** `http://localhost:3000`

**Auth Header:** `Authorization: Bearer YOUR_JWT_TOKEN`

## 🔐 Auth

**Register:** `POST /register`

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Login:** `POST /login`

```json
{ "email": "user@example.com", "password": "SecurePass123!" }
```

→ Returns JWT token. Store it!

## 👤 User

**Get Profile:** `GET /profile` 🔐

**Update Profile:** `PUT /profile` 🔐

```json
{ "username": "newname", "bio": "My bio", "isPrivate": true }
```

**Change Password:** `PUT /password` 🔐

```json
{ "currentPassword": "old", "newPassword": "new" }
```

## 📝 Posts

**Create:** `POST /posts` 🔐

```json
{ "caption": "My post!", "mediaUrl": "https://image.jpg" }
```

**Update:** `PUT /:postId` 🔐  
**Delete:** `DELETE /:postId` 🔐

**My Posts:** `GET /posts/mine` 🔐  
**Following Feed:** `GET /posts/following` 🔐  
**For You Feed:** `GET /posts/for-you` 🔐

## 💬 Comments

**Get:** `GET /:postId/comments` 🔐  
**Create:** `POST /:postId/comments` 🔐

```json
{ "comment": "Nice post!" }
```

**Update:** `PUT /:commentId` 🔐

```json
{ "comment": "Updated comment text!" }
```

**Delete:** `DELETE /:commentId` 🔐

## ❤️ Likes

**Like:** `POST /:postId/likes` 🔐  
**Unlike:** `DELETE /:postId/likes` 🔐  
**Count:** `GET /:postId/likes` 🔐

## 👥 Follow

**Follow:** `POST /:username/follow` 🔐  
**Unfollow:** `DELETE /:username/unfollow` 🔐  
**My Followers:** `GET /followers` 🔐  
**Following:** `GET /following` 🔐

## 🔍 Search

**Search Users:** `GET /search?username=john`
