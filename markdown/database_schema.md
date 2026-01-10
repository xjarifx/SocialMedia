# Social Media Database Schema

## Overview

This document outlines the database schema for the social media application, including all tables, relationships, indexes, and constraints.

---

## Core Tables

### 1. Users

Stores user account information and profile details.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    fullname VARCHAR(48),
    username VARCHAR(24) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    last_login TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('active', 'suspended'))
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

| Column     | Type         | Constraints                              |
| ---------- | ------------ | ---------------------------------------- |
| `id`       | BIGSERIAL    | PRIMARY KEY                              |
| `username` | VARCHAR(24)  | UNIQUE, NOT NULL                         |
| `email`    | VARCHAR(255) | UNIQUE, NOT NULL                         |
| `phone`    | VARCHAR(20)  | UNIQUE                                   |
| `status`   | VARCHAR(20)  | DEFAULT 'active', CHECK ('active', 'suspended') |

---

### 2. Posts

Stores user posts and media content.

```sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    media_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Indexes
CREATE INDEX idx_posts_user_id_created_at ON posts(user_id, created_at DESC);
```

| Column    | Type      | Constraints                                 |
| --------- | --------- | ------------------------------------------- |
| `id`      | BIGSERIAL | PRIMARY KEY                                 |
| `user_id` | BIGINT    | NOT NULL, FK → users(id), ON DELETE CASCADE |

---

### 3. Comments

Stores comments on posts.

```sql
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Indexes
CREATE INDEX idx_comments_post_id_created_at ON comments(post_id, created_at ASC);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

| Column    | Type      | Constraints                                 |
| --------- | --------- | ------------------------------------------- |
| `id`      | BIGSERIAL | PRIMARY KEY                                 |
| `post_id` | BIGINT    | NOT NULL, FK → posts(id), ON DELETE CASCADE |
| `user_id` | BIGINT    | NOT NULL, FK → users(id), ON DELETE CASCADE |
| `comment` | TEXT      | NOT NULL                                    |

---

### 4. Post Likes

Stores likes for posts.

```sql
CREATE TABLE post_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT unique_post_like UNIQUE(user_id, post_id)
);

-- Indexes
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
```

**Constraints:**

- `unique_post_like` — Prevents duplicate likes from the same user on a post

---

### 5. Follows

Manages user follow relationships.

```sql
CREATE TABLE follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT unique_follow UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

-- Indexes
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

**Constraints:**

- `unique_follow` — Prevents duplicate follow relationships
- `no_self_follow` — Prevents users from following themselves

---

### 6. Blocks

Manages user block relationships.

```sql
CREATE TABLE blocks (
    id BIGSERIAL PRIMARY KEY,
    blocker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT unique_block UNIQUE(blocker_id, blocked_id),
    CONSTRAINT no_self_block CHECK (blocker_id <> blocked_id)
);

-- Indexes
CREATE INDEX idx_blocks_blocker_id ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked_id ON blocks(blocked_id);
```

**Constraints:**

- `unique_block` — Prevents duplicate block relationships
- `no_self_block` — Prevents users from blocking themselves

---

## Future Tables

### 7. Password Resets

For handling password reset functionality.

```sql
CREATE TABLE password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Indexes
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_token ON password_resets(token);
```

---

### 8. Notifications

For managing user notifications.

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
```

| Type      | Description                    |
| --------- | ------------------------------ |
| `like`    | Someone liked your post        |
| `comment` | Someone commented on your post |
| `follow`  | Someone followed you           |
| `mention` | Someone mentioned you          |

---

## Relationships Summary

```
┌─────────┐       ┌─────────┐       ┌──────────┐
│  Users  │──1:N──│  Posts  │──1:N──│ Comments │
└─────────┘       └─────────┘       └──────────┘
     │                 │                  │
     │                 │                  │
     └────────1:N──────┴────────1:N───────┘
                       │
                 ┌─────┴─────┐
                 │ Post Likes│
                 └───────────┘

┌─────────┐               ┌─────────┐
│  Users  │──N:N (self)───│ Follows │
└─────────┘               └─────────┘

┌─────────┐               ┌─────────┐
│  Users  │──N:N (self)───│ Blocks  │
└─────────┘               └─────────┘
```

| Relationship            | Type | Description                    |
| ----------------------- | ---- | ------------------------------ |
| Users → Posts           | 1:N  | A user can create many posts   |
| Posts → Comments        | 1:N  | A post can have many comments  |
| Users → Comments        | 1:N  | A user can write many comments |
| Users → Post Likes      | 1:N  | A user can like many posts     |
| Posts → Post Likes      | 1:N  | A post can have many likes     |
| Users → Users (Follows) | N:N  | Users can follow many users    |
| Users → Users (Blocks)  | N:N  | Users can block many users     |

---

## Common Conventions

All tables follow these conventions:

- **Soft Deletes**: `deleted_at` column for soft deletion support
- **Timestamps**: `created_at` and `updated_at` for audit trails
- **Primary Keys**: `BIGSERIAL` for auto-incrementing IDs
- **Foreign Keys**: Cascade deletes where appropriate
- **Naming**: Snake_case for columns and tables
