# Project Problems Report

Generated: 2026-05-10

---

## 1. Security Issues

### 1.1 Hardcoded Fallback JWT Secrets
- **`lib/auth.ts:4`** — `JWT_SECRET` falls back to `"fallback-jwt-secret"` (plaintext, guessable)
- **`lib/services/auth.service.ts:9`** — Same fallback for JWT_SECRET
- **`lib/services/auth.service.ts:11`** — `REFRESH_TOKEN_SECRET` falls back to `"fallback-refresh-secret"`

These fallbacks are used in production builds when env vars are not set, making JWT signing/verification trivially forgeable.

### 1.2 `.env` Contains Real Credentials
`.env` exists (not gitignored properly? — `.gitignore` has `.env*` but the file was listed in the directory tree). It contains real DB, Redis, ImageKit, and Stripe test credentials. If committed, this is a credential leak.

### 1.3 `DATABASE_URL` Uses Non-Null Assertion
- **`lib/prisma.ts:9`** — `process.env.DATABASE_URL!` crashes with a cryptic error if the env var is missing
- **`prisma.config.ts:11`** — Same issue

### 1.4 Empty Catch Block Swallows Errors
- **`lib/services/api.ts:228`** — `catch {}` silently discards JSON parse errors, returning a generic "API Error: 500" message

### 1.5 No Server-Side Password Validation
- **`lib/services/auth.service.ts:32-38`** — `register()` accepts passwords of any length/strength. The Zod validation in the route also doesn't enforce password requirements. Only client-side validates (uppercase, number, special char).

### 1.6 Stripe Webhook Not Idempotent
- **`lib/services/billing.service.ts:256-304`** — Webhook handler doesn't check if the user already upgraded before applying plan changes. Duplicate webhook events could cause redundant DB writes.

### 1.7 CORS / Open API Docs
- **`app/api-docs/route.ts`** — Serves Swagger UI, may expose API surface in production

---

## 2. Environment Variable Management

### 2.1 Env Vars Used Without Guards (43 occurrences across the codebase)
Key offenders:
- `lib/auth.ts:4`, `lib/services/auth.service.ts:9-11` — fallback strings instead of runtime validation
- `lib/imagekit.ts:3-5` — empty string fallbacks; ImageKit will fail at runtime with opaque errors
- `lib/services/billing.service.ts:6-10` — empty string fallbacks; Stripe operations will fail
- `lib/prisma.ts:9`, `prisma.config.ts:11` — `!` assertions that throw `TypeError` instead of a clear message

### 2.2 Duplicate Env Var Declaration
- `next.config.ts:10` — `NEXT_PUBLIC_API_URL` is also declared in `.env.example`. The env block in next.config is redundant for public env vars (Next.js automatically exposes `NEXT_PUBLIC_*`).

---

## 3. TypeScript / Type Safety Issues

### 3.1 Widespread `any` Usage (~30+ occurrences)

| File | Line | Issue |
|---|---|---|
| `lib/imagekit.ts` | 11, 17 | `as any` on constructor and upload call |
| `lib/services/posts.service.ts` | 15, 222, 318, 367 | `mapPost(post: any)`, `visibility as any`, `c: any` |
| `lib/services/comments.service.ts` | 48, 147, 279, 311, 350 | `tx: any`, `comments: any[]` |
| `lib/services/likes.service.ts` | 32, 92, 136 | `tx: any`, `l: any` |
| `lib/services/blocks.service.ts` | 81 | `b: { blocked: any }` |
| `lib/services/notifications.service.ts` | 46 | `n: any` |
| `lib/services/user.service.ts` | 140, 151, 166, 206, 223 | `p: any`, `as any`, `whereClause: any` |
| `lib/cache.ts` | 21, 60 | `entry.value as T` — unsafe cast |

### 3.2 Missing Prisma TransactionClient Type
All `tx: any` in `$transaction` callbacks should use `Prisma.TransactionClient`:
- `comments.service.ts:48,279,311,350`
- `likes.service.ts:32,92`

### 3.3 Unsafe `JSON.parse` in Redis Cache
- **`lib/cache.ts:55`** — `JSON.parse(raw)` can throw if Redis stores invalid JSON; no try/catch

---

## 4. Error Handling

### 4.1 Missing NaN Validation on Query Parameters
Multiple API routes use `parseInt` without checking `isNaN`:
- `app/api/v1/posts/route.ts:16-17`
- `app/api/v1/posts/feed/route.ts` (likely same pattern)
- `app/api/v1/blocks/route.ts:15-16`
- `app/api/v1/notifications/route.ts` (likely same pattern)

Passing non-numeric values (e.g. `?limit=abc`) produces `NaN` silently.

### 4.2 Silent Error Swallowing
Several catch blocks log but don't propagate errors:
- `lib/services/api.ts:228` — empty catch `{}`
- `lib/services/billing.service.ts:213` — empty catch during subscription cancel
- `lib/hooks/useComments.ts` — numerous `console.error` without user feedback
- `lib/hooks/useDraft.ts` — local storage errors silently logged
- `lib/context/BlockContext.tsx:33` — blocks load failure silently logged

### 4.3 Inconsistent Error Response Shape
- **`lib/errors.ts:16-17`** — Returns `{ success: false, data: null, error: message }`
- **`app/api/v1/posts/route.ts:38`** — Uses `new AppError(error.issues[0].message)` which loses field-level error details from Zod

---

## 5. Code Quality & Maintainability

### 5.1 Duplicated Block Filtering Logic
- **`lib/services/posts.service.ts:40-54`** and **`102-116`** — The block filtering (fetch + build set) is identical in `getFeed` and `getForYouFeed`. Should be extracted.

### 5.2 No Pagination on Followers/Following Endpoints
- **`lib/services/user.service.ts:196-228`** — `getUserFollowers` and `getUserFollowing` fetch ALL records without limit/offset. Will break with large user bases.

### 5.3 In-Memory Rate Limiter Not Cluster-Safe
- **`lib/rate-limit.ts`** — Uses a `Map` in memory. Won't work across multiple server instances or serverless deployments.

### 5.4 MemoryCache Has No Eviction Policy
- **`lib/cache.ts:11-43`** — Never evicts entries except by TTL expiration. A memory leak exists if keys are set without TTL expiry or if patterns don't match.

### 5.5 Hardcoded Values Scattered
- **`app/api/v1/posts/route.ts:8`** — Zod schema hardcodes `max(100)` while actual limits are 20 (FREE) / 100 (PRO)
- **`lib/rate-limit.ts:25-26`** — Limits hardcoded (100 general, 10 create post)
- **`prisma/seed.ts`** — Many hardcoded seed values (batch sizes, user counts, etc.)
- **`app/(auth)/login/page.tsx:218`** — Test account password `"Password123!"` hardcoded
- **`lib/transformPost.ts:42`** — DiceBear avatar URL hardcoded

### 5.6 Login/Register Styling Inconsistency
- **`app/(auth)/login/page.tsx`** — Uses hardcoded color values (`#ea4335`, `#f91880`, `#1d9bf0`)
- **`app/(auth)/register/page.tsx`** — Uses Tailwind semantic classes (`text-danger`, `bg-danger`, `text-accent`)

### 5.7 Broad Cache Invalidation
- **`lib/services/posts.service.ts:237-239,382-385,412-416`** — `invalidatePattern("feed:*")` invalidates ALL users' cached feeds, not just the affected user's

---

## 6. Prisma Schema Issues

### 6.1 Missing Indexes
The following fields are queried frequently but have no indexes:

| Model | Field(s) | Query Pattern |
|---|---|---|
| `Post` | `authorId` | Joins, filtering by author |
| `Post` | `visibility`, `createdAt` | Feed queries filtering by PUBLIC |
| `Comment` | `postId` | Fetching comments by post |
| `Comment` | `parentId` | Fetching reply trees |
| `Like` | `postId` | Counting likes, fetching by post |
| `Notification` | `userId` | Fetching user notifications |
| `Notification` | `relatedUserId` | Joins |

### 6.2 `@@unique([blockerId, blockedId])` Allows Bidirectional Blocks
- **`prisma/schema.prisma:179`** — `@@unique([blockerId, blockedId])` prevents (A,B) duplicates but allows (B,A). The `checkBlockStatus` in `blocks.service.ts:84-98` uses `findFirst` with `OR` which could miss one direction.

### 6.3 No `deletedAt` Filter in Many Queries
Multiple queries don't filter by `deletedAt: null`:
- `user.service.ts:109-136` — `getUserPosts`
- `user.service.ts:197-204` — `getUserFollowers`
- `user.service.ts:214-221` — `getUserFollowing`
- `posts.service.ts:56-85` — `getFeed`

This means soft-deleted records might be returned.

### 6.4 `Plan` Enum is String-Based
- **`prisma/schema.prisma:16-19`** — Uses PostgreSQL enum. Adding new plans requires a migration, unlike using a string field with a check constraint.

---

## 7. Potential Bugs

### 7.1 `countCommentSubtree` Doesn't Track Starting Comment
- **`lib/services/comments.service.ts:7-26`** — The `visited` set doesn't include the starting `commentId`. The BFS traverses children but doesn't guard against edge cases where `parentId` might create a cycle (though DB constraints prevent this).

### 7.2 `getBlockedUsers` Returns Only User Data, Not Block Records
- **`lib/services/blocks.service.ts:65-82`** — Returns `b.blocked` (User data) without the block record metadata. The frontend (`api.ts:547-592`) has complex fallback logic to reconstruct `BlockedUser` from raw arrays or object responses, indicating a mismatch.

### 7.3 Stripe Confirm Doesn't Set Subscription Fields
- **`lib/services/billing.service.ts:134-148`** — On successful checkout confirmation, the code updates `plan`, `planStatus`, and `planStartedAt` but does NOT set `stripeSubscriptionId` or `stripeCurrentPeriodEndAt`. These are only set in the webhook handler but the `confirmPayment` endpoint is the synchronous path users hit after redirect.

### 7.4 No Block Check Before Creating Notifications
- **`lib/services/comments.service.ts:75-89`** — Creates notification for post author even if the author has blocked the commenter
- **`lib/services/likes.service.ts:47-57`** — Same issue
- **`lib/services/follows.service.ts:52-59`** — Same issue

### 7.5 `visibility as any` Cast Loses Type Safety
- **`lib/services/posts.service.ts:222,367`** — Casting visibility to `any` bypasses the `PostVisibility` enum check. A invalid string could be written to DB.

### 7.6 Follow/Unfollow Race Condition
- **`lib/services/follows.service.ts:43-45`** vs **`lib/services/follows.service.ts:74`** — `create` and `delete` are not wrapped in a transaction. Concurrent requests could create duplicate follows or delete non-existent ones.

---

## 8. Configuration Issues

### 8.1 Lint Script Broken
- **`package.json:9`** — `"lint": "next lint"` fails with:
  ```
  Invalid project directory provided, no such directory: .../lint
  ```
  The ESLint config (`eslint.config.mjs`) imports from `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`, which may not be the correct package names for Next.js 16.

### 8.2 Unversioned Dependency
- **`package.json:37`** — `"lucide-react": "latest"` will pull untested breaking changes on `npm install`

### 8.3 Potentially Unused Dependency
- **`package.json:44`** — `swagger-ui-dist` is in dependencies. The app serves Swagger UI via CDN (`app/api-docs/route.ts`), so this npm package may be unused.

### 8.4 `generated/prisma/` in Version Control
- The `generated/prisma/` directory (containing the Prisma client, WASM files, etc.) appears to be in the project tree. Generated files should not be committed.

---

## 9. Testing & Monitoring Gaps

### 9.1 No Tests
- No test files found anywhere in the project. Zero test scripts in `package.json`.

### 9.2 No Request Logging Middleware
- API routes have no structured logging for requests, responses, or errors.

### 9.3 No Health Check for Database
- **`app/api/v1/health/cache/route.ts`** — Only checks cache health; no database connectivity check.

---

## 10. Build Warnings

### 10.1 `url.parse()` Deprecation Warning
- During `next build`, multiple `DEP0169` warnings appear:
  ```
  [DEP0169] DeprecationWarning: url.parse() behavior is not standardized and prone to errors that have security implications.
  ```
  This comes from a dependency (likely `next` or `stripe`), but should be investigated.

---

**End of report.**
