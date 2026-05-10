# Better Media

A full-stack social media platform with Twitter/X-like functionality — user profiles, posts and feeds, threaded comments, likes, follows, notifications, user blocking, and PRO subscription via Stripe.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| UI Kit | Radix UI primitives, Lucide icons, Sonner toasts |
| Database | PostgreSQL via Prisma 7 ORM |
| Cache | Redis (optional, falls back to in-memory Map) |
| Auth | JWT (access + refresh tokens) with bcryptjs |
| Payments | Stripe (checkout sessions & payment intents) |
| Media | ImageKit CDN |

## Features

- **Authentication** — Register, login, JWT token rotation & revocation
- **Posts** — Create with optional image; public or private visibility
- **Feeds** — *Following* feed (people you follow) and *For You* feed (2nd-degree connections)
- **Comments** — Threaded replies with nested support
- **Likes** — Like/unlike posts and comments
- **Follows** — Follow/unfollow with notification generation
- **Notifications** — Like, comment, and new follower notifications
- **Blocking** — Block/unblock users; removes follows, excludes from feeds
- **PRO Subscriptions** — Stripe-powered upgrade; expanded post character limit
- **User Search** — Case-insensitive partial match on name/username
- **API Docs** — Live Swagger UI at `/api-docs` (OpenAPI 3.0.3)

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- (Optional) Redis instance
- (Optional) ImageKit account
- (Optional) Stripe account for billing features

### Setup

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env
```

Edit `.env` with your database connection string and any optional service credentials.

```bash
# Push the schema to your database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed

# Start the dev server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migration |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database |

## API

All API routes are prefixed with `/api/v1`. Full interactive documentation is available at `/api-docs` when the server is running.

### Key Endpoints

| Group | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh` |
| Posts | `GET/POST /posts`, `GET /posts/feed`, `GET /posts/for-you`, `GET/PATCH/DELETE /posts/:postId` |
| Likes | `POST/DELETE /posts/:postId/likes` |
| Comments | `GET/POST /posts/:postId/comments`, `PATCH/DELETE /posts/:postId/comments/:commentId` |
| Users | `GET/PATCH /users/me`, `GET /users/:userId`, `GET /users/search` |
| Follows | `POST /users/:userId/follow`, `DELETE /users/:userId/follow/:followingId` |
| Notifications | `GET /notifications`, `GET/PATCH/DELETE /notifications/:notificationId` |
| Blocks | `GET/POST/DELETE /blocks` |
| Billing | Stripe session creation, webhooks, plan management |

## Project Structure

```
app/               Next.js App Router (pages + API routes)
components/        React components (Feed, PostCard, modals, UI primitives)
lib/               Core logic (auth, cache, Prisma client, services, hooks)
prisma/            Database schema and seed script
docs/              Additional documentation
```

## License

MIT
