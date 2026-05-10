# Better Media API Documentation

Base URL: `/api/v1`

## Standard Response Envelope

All API responses follow a consistent format:

**Success:**
```json
{ "success": true, "data": { ... }, "error": null }
```

**Error:**
```json
{ "success": false, "data": null, "error": "<message>" }
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No content (some DELETE) |
| 400 | Validation error / bad request |
| 401 | Authentication required / invalid token |
| 403 | Forbidden (not authorized, private resource, block) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, already following, already liked, already blocked) |
| 500 | Internal server error |

### Authentication

Most endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

Access tokens are JWT-based, short-lived (default 5 min). Refresh tokens (default 30 days) are stored in the database with revocation support. Token rotation is used on refresh.

### Pagination

Paginated endpoints accept `limit` and `offset` query parameters and return:
```json
{
  "data": { "...": [], "total": 50, "limit": 20, "offset": 0 }
}
```

---

## Data Types

### User
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "ISO8601",
  "plan": "FREE | PRO"
}
```

### UserSummary
```json
{
  "id": "uuid",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "plan": "FREE | PRO"
}
```

### Post
```json
{
  "id": "uuid",
  "content": "string",
  "imageUrl": "string | null",
  "visibility": "PUBLIC | PRIVATE",
  "likesCount": "number",
  "commentsCount": "number",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "author": "User (author)",
  "likes": ["userId (string)"],
  "comments": ["Comment (when included)"]
}
```

### Comment
```json
{
  "id": "uuid",
  "postId": "uuid",
  "parentId": "uuid | null",
  "content": "string",
  "likesCount": "number",
  "repliesCount": "number",
  "createdAt": "ISO8601",
  "author": "UserSummary"
}
```

### Follower
```json
{
  "id": "uuid",
  "followedAt": "ISO8601",
  "follower": "UserSummary",
  "user": "UserSummary"
}
```

### Notification
```json
{
  "id": "uuid",
  "type": "LIKE | COMMENT | NEW_FOLLOWER",
  "message": "string",
  "read": "boolean",
  "createdAt": "ISO8601",
  "relatedUser": "UserSummary | null",
  "relatedPost": { "id": "uuid", "content": "string" } | null
}
```

### BlockedUser
```json
{
  "id": "uuid",
  "blockedAt": "ISO8601",
  "user": "UserSummary"
}
```

### BillingStatus
```json
{
  "id": "uuid",
  "email": "string",
  "plan": "FREE | PRO",
  "planStatus": "string | null",
  "planStartedAt": "ISO8601 | null",
  "stripeCurrentPeriodEndAt": "ISO8601 | null",
  "stripeSubscriptionId": "string | null"
}
```

---

## API Endpoints

### Authentication

#### POST /auth/register
Create a new user account.

- **Auth:** None
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "string (min 2)",
  "email": "string (valid email)",
  "password": "string (min 8, must contain uppercase, number, special char)",
  "firstName": "string (min 1)",
  "lastName": "string (min 1)"
}
```

**Response (201):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": "User"
}
```

**Errors:** 409 (email/username taken)

---

#### POST /auth/login
Log in with email and password.

- **Auth:** None
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": "User"
}
```

**Errors:** 401 (invalid credentials)

---

#### POST /auth/logout
Revoke the current refresh token.

- **Auth:** Required
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{ "message": "Logged out successfully" }
```

**Errors:** 401 (invalid/revoked token)

---

#### POST /auth/refresh
Obtain a new access/refresh token pair.

- **Auth:** None
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": "User"
}
```

**Errors:** 401 (invalid/revoked/expired token)

---

### Posts

#### GET /posts
Get the "Following" feed -- PUBLIC posts from users the authenticated user follows.

- **Auth:** Required
- **Content-Type:** `application/json`

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 20 | Max items per page |
| offset | number | 0 | Number of items to skip |

**Response (200):** `Post[]`

**Cache:** 30s (keyed by userId, limit, offset). Invalidated on post create/update/delete.

---

#### POST /posts
Create a new post.

- **Auth:** Required
- **Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | Yes* | Post text. Max length depends on plan (FREE: 20, PRO: 100) |
| image | file | No | Image file (uploaded to ImageKit) |
| visibility | string | No | `PUBLIC` or `PRIVATE` (default: `PUBLIC`) |

*Either `content` or `image` must be provided.

**Response (201):** `Post`

**Errors:** 400 (content exceeds plan limit, missing content+image), 404 (user not found)

---

#### GET /posts/feed
Alias for `GET /posts`. Returns the following feed.

- **Auth:** Required

**Query Params:** Same as `GET /posts`
**Response (200):** `Post[]`

---

#### GET /posts/for-you
Get the "For You" feed -- PUBLIC posts from 2nd-degree connections (users followed by users you follow), excluding direct followings and blocked users.

- **Auth:** Required

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| limit | number | 20 |
| offset | number | 0 |

**Response (200):** `Post[]`

**Cache:** 30s. Returns empty array if user follows nobody.

---

#### GET /posts/[postId]
Get a single post with its top-level comments.

- **Auth:** Optional (required for PRIVATE posts)

**Response (200):** `Post` (includes `comments[]` with up to 10 top-level comments)

**Errors:** 404 (not found), 403 (private post)

**Cache:** 60s

---

#### PATCH /posts/[postId]
Update a post's content and/or visibility.

- **Auth:** Required (must be post author)
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "content": "string (optional, max depends on plan)",
  "visibility": "PUBLIC | PRIVATE (optional)"
}
```

**Response (200):** `Post`

**Errors:** 403 (not author), 404 (not found), 400 (exceeds plan limit)

---

#### DELETE /posts/[postId]
Delete a post.

- **Auth:** Required (must be post author)

**Response (200):** `{ "message": "Post deleted successfully" }`

**Errors:** 403 (not author), 404 (not found)

---

### Post Likes

#### POST /posts/[postId]/likes
Like a post. Creates a notification for the post author (unless liking own post).

- **Auth:** Required

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "postId": "uuid",
  "createdAt": "ISO8601",
  "message": "Post liked successfully"
}
```

**Errors:** 404 (not found), 400 (already liked)

---

#### DELETE /posts/[postId]/likes
Unlike a post.

- **Auth:** Required

**Response (200):** `{ "message": "Post unliked successfully" }`

**Errors:** 404 (post not found / like not found)

---

#### GET /posts/[postId]/likes
Get list of users who liked a post.

- **Auth:** Required

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| limit | number | 20 |
| offset | number | 0 |

**Response (200):**
```json
{
  "likes": [{ "id": "uuid", "userId": "uuid", "postId": "uuid", "user": "UserSummary", "createdAt": "ISO8601" }],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

---

### Comments

#### POST /posts/[postId]/comments
Create a comment (or reply to a comment) on a post. Creates a notification for the post author.

- **Auth:** Required
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "content": "string (min 1, max 500)",
  "parentId": "uuid | null (optional, for replies)"
}
```

**Response (201):** `Comment`

**Errors:** 404 (post/parent comment not found)

---

#### GET /posts/[postId]/comments
Get comments for a post (paginated). When authenticated, the user's own comments appear first.

- **Auth:** Required

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 10 | Max items per page |
| offset | number | 0 | Number of items to skip |
| parentId | string | null | Filter by parent (for fetching replies) |

**Response (200):**
```json
{
  "comments": ["Comment"],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

**Cache:** 30s

---

#### PATCH /posts/[postId]/comments/[commentId]
Update a comment's content.

- **Auth:** Required (must be comment author)
- **Content-Type:** `application/json`

**Request Body:**
```json
{ "content": "string (min 1, max 500)" }
```

**Response (200):** `Comment`

**Errors:** 403 (not author), 404 (not found)

---

#### DELETE /posts/[postId]/comments/[commentId]
Delete a comment and all its replies (subtree). Decrements the post's `commentsCount` by the total subtree count.

- **Auth:** Required (must be comment author)

**Response (200):**
```json
{ "message": "Comment deleted successfully", "deletedCount": "number" }
```

**Errors:** 403 (not author), 404 (not found)

---

### Comment Likes

#### POST /posts/[postId]/comments/[commentId]/likes
Like a comment.

- **Auth:** Required

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "commentId": "uuid",
  "createdAt": "ISO8601",
  "message": "Comment liked successfully"
}
```

**Errors:** 404 (not found), 400 (already liked)

---

#### DELETE /posts/[postId]/comments/[commentId]/likes
Unlike a comment.

- **Auth:** Required

**Response (200):** `{ "message": "Comment unliked successfully" }`

**Errors:** 404 (comment not found / like not found)

---

### Users

#### GET /users/me
Get the authenticated user's profile.

- **Auth:** Required

**Response (200):** `User`

---

#### PATCH /users/me
Update the authenticated user's profile.

- **Auth:** Required
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "firstName": "string (optional, min 1)",
  "lastName": "string (optional, min 1)"
}
```

**Response (200):** `User`

---

#### GET /users/[userId]
Get a public user profile.

- **Auth:** None

**Response (200):** `User`

**Errors:** 404 (not found)

**Cache:** 120s

---

#### GET /users/[userId]/posts
Get a user's posts (paginated).

- **Auth:** Optional (viewer sees own PRIVATE posts; others see only PUBLIC)

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| limit | number | 10 |
| offset | number | 0 |

**Response (200):**
```json
{
  "posts": ["Post"],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

**Cache:** 30s. Returns empty if viewer is blocked by the user.

---

#### POST /users/[userId]/follow
Follow a user. Creates a `NEW_FOLLOWER` notification for the target user.

- **Auth:** Required

**Response (201):** `Follower`

**Errors:** 400 (cannot follow self), 403 (block relationship), 404 (not found), 409 (already following)

---

#### DELETE /users/[userId]/follow/[followingId]
Unfollow a user.

- **Auth:** Required

**Response (200):** `{ "deleted": true }`

**Errors:** 403 (not allowed), 404 (follow relationship not found)

---

#### GET /users/[userId]/followers
Get a user's followers.

- **Auth:** Required

**Response (200):**
```json
[
  { "id": "uuid", "followedAt": "ISO8601", "follower": "UserSummary" }
]
```

---

#### GET /users/[userId]/following
Get who a user follows.

- **Auth:** Required

**Response (200):**
```json
[
  { "id": "uuid", "followedAt": "ISO8601", "user": "UserSummary" }
]
```

---

#### GET /users/search
Search users by name or username (case-insensitive, partial match).

- **Auth:** Required

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| q | string | (required) | Search query |
| limit | number | 10 | |
| offset | number | 0 | |

**Response (200):**
```json
{
  "results": ["User"],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

---

### Notifications

#### GET /notifications
List notifications for the authenticated user.

- **Auth:** Required

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| limit | number | 20 |
| offset | number | 0 |

**Response (200):**
```json
{
  "notifications": ["Notification"],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

**Cache:** 20s

---

#### GET /notifications/[notificationId]
Get a single notification.

- **Auth:** Required (must be the recipient)

**Response (200):** `Notification`

**Errors:** 404 (not found)

**Cache:** 20s (keyed by notificationId + userId)

---

#### PATCH /notifications/[notificationId]
Mark a notification as read or unread.

- **Auth:** Required (must be the recipient)
- **Content-Type:** `application/json`

**Request Body:**
```json
{ "read": true }
```

**Response (200):** `Notification`

**Errors:** 404 (not found)

---

#### DELETE /notifications/[notificationId]
Delete a notification.

- **Auth:** Required (must be the recipient)

**Response (200):** `{ "message": true }`

**Errors:** 404 (not found)

---

### Blocks

#### GET /blocks
List blocked users.

- **Auth:** Required

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| limit | number | 20 |
| offset | number | 0 |

**Response (200):**
```json
{
  "blocked": ["BlockedUser"],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

---

#### POST /blocks
Block a user by username. Removes any existing follow relationships in both directions.

- **Auth:** Required
- **Content-Type:** `application/json`

**Request Body:**
```json
{ "username": "string" }
```

**Response (201):** `Block` (raw block record)

**Errors:** 400 (cannot block self), 404 (user not found), 409 (already blocked)

---

#### DELETE /blocks
Unblock a user by username.

- **Auth:** Required
- **Content-Type:** `application/json`

**Request Body:**
```json
{ "username": "string" }
```

**Response (200):** `{ "message": true }` (raw block record in data)

**Errors:** 400 (cannot unblock self), 404 (user not found / not blocked)

---

#### GET /blocks/check/[userId]
Check block status between the authenticated user and another user.

- **Auth:** Required

**Response (200):**
```json
{
  "isBlocked": "boolean",
  "blockedByMe": "boolean",
  "blockedByThem": "boolean"
}
```

---

### Billing

#### GET /billing/me
Get the current user's billing status and plan details.

- **Auth:** Required

**Response (200):** `BillingStatus`

---

#### POST /billing/create-checkout-session
Create a Stripe Checkout Session for upgrading to the PRO plan.

- **Auth:** Required

**Response (200):**
```json
{ "url": "string (Stripe checkout URL)" }
```

**Errors:** 400 (already on PRO plan), 404 (user not found)

---

#### POST /billing/create-payment-intent
Create a Stripe Payment Intent for the PRO plan.

- **Auth:** Required

**Response (200):**
```json
{ "clientSecret": "string" }
```

**Errors:** 400 (already on PRO plan), 404 (user not found)

---

#### GET /billing/confirm
Confirm a payment after redirect from Stripe. Validates the session/payment intent belongs to the authenticated user and updates their plan to PRO.

- **Auth:** Required

**Query Params (at least one required):**
| Param | Type | Description |
|-------|------|-------------|
| session_id | string | Stripe Checkout Session ID |
| payment_intent_id | string | Stripe Payment Intent ID |

**Response (200):**
```json
{
  "paymentStatus": "string",
  "amount": "number (cents)",
  "currency": "string",
  "plan": "FREE | PRO"
}
```

**Errors:** 400 (missing params), 403 (payment doesn't belong to user)

---

#### POST /billing/downgrade
Downgrade from PRO to FREE plan. Cancels any active Stripe subscription.

- **Auth:** Required

**Response (200):**
```json
{
  "id": "uuid",
  "email": "string",
  "plan": "FREE",
  "planStatus": null
}
```

**Errors:** 400 (already on FREE plan), 404 (user not found)

---

#### POST /billing/webhook
Stripe webhook endpoint. Handles `checkout.session.completed` and `payment_intent.succeeded` events to upgrade users to PRO.

- **Auth:** Stripe signature (in `stripe-signature` header)
- **Content-Type:** `application/json`

**Request Body:** Raw Stripe event JSON

**Response (200):** `{ "received": true }`

**Errors:** 400 (invalid signature), 500 (webhook secret not configured)

---

#### GET /billing/webhook-health
Health check for the webhook configuration.

- **Auth:** None

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "ISO8601",
  "webhookSecret": "string (masked)"
}
```

---

#### GET /billing/debug/recent-sessions
Debug endpoint -- fetches Stripe customer and recent checkout sessions for the current user.

- **Auth:** Required

**Response (200):** Stripe customer and sessions data (variable structure)

---

### Health

#### GET /health/cache
Check if the cache system is operational.

- **Auth:** None

**Response (200):**
```json
{
  "status": "ok",
  "cacheEnabled": true,
  "timestamp": "ISO8601"
}
```

---

## Caching Strategy

| Domain | TTL | Cache Key Pattern |
|--------|-----|-------------------|
| Feed (Following) | 30s | `feed:{userId}:{limit}:{offset}` |
| Feed (For You) | 30s | `for-you:{userId}:{limit}:{offset}` |
| Single Post | 60s | `post:{postId}:viewer:{userId}` |
| User Profile | 120s | `user:public:{userId}` |
| User Timeline | 30s | `timeline:{userId}:{viewerId}:{limit}:{offset}` |
| Comments | 30s | `comments:{postId}:{parentId}:{limit}:{offset}:{userId}` |
| Notifications | 20s | `notifications:{userId}:{readFilter}:{limit}:{offset}` |

Cache backend: Redis (if `REDIS_URL` is set) or in-memory `Map` fallback.

---

## Content Limits

| Plan | Post max chars |
|------|---------------|
| FREE | 20 |
| PRO | 100 |

Comments: max 500 chars (all plans).

---

## Rate Limiting

Defined but not yet wired into route handlers:

| Scope | Limit | Window |
|-------|-------|--------|
| General | 100 req | 1 min |
| Create Post | 10 req | 1 min |

---

## Input Validation (Zod)

| Endpoint | Key Rules |
|----------|-----------|
| Register | username (min 2), email (valid), password (min 8, uppercase+number+special), firstName/lastName (min 1) |
| Login | email (valid), password (min 1) |
| Create Post | content (max 100), visibility (PUBLIC\|PRIVATE, optional) |
| Update Post | content (max 100, optional), visibility (optional) |
| Create Comment | content (min 1, max 500), parentId (nullable, optional) |
| Update Comment | content (min 1, max 500) |
| Update Profile | firstName (min 1, optional), lastName (min 1, optional) |
| Block/Unblock | username (min 1) |

---

## Feed Algorithm

**Following Feed:** PUBLIC posts from users the authenticated user follows, excluding blocked users and self, sorted by `createdAt DESC`.

**For You Feed:** PUBLIC posts from 2nd-degree connections (users followed by users the authenticated user follows), excluding direct followings, blocked users, and self, sorted by `createdAt DESC`. Returns empty if user follows nobody.

---

## Notification Triggers

| Action | Notification Type | Recipient |
|--------|-------------------|-----------|
| Like a post | `LIKE` | Post author |
| Comment on a post | `COMMENT` | Post author |
| Follow a user | `NEW_FOLLOWER` | Followed user |

Notifications are created within the same database transaction as the triggering action.

---

## Blocking Behavior

- Blocks are bidirectional (either user can block the other)
- Blocking a user removes all follow relationships in both directions
- Blocked users are excluded from all feeds
- Checking block status returns `blockedByMe` and `blockedByThem` flags
- Blocking prevents follows (403 if block relationship exists)

---

## Image Upload

- Provider: ImageKit CDN
- Upload path: `/better-media/posts/`
- Files sent as `multipart/form-data`, converted to base64 for ImageKit API
- Set `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` in env
