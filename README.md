# Social Network Platform

A full-stack social media application built with **Next.js 16**, React 19, TypeScript, TailwindCSS v4, and Prisma.

## Features

- **Authentication** - JWT-based auth with refresh tokens
- **User Profiles** - Customizable profiles
- **Posts** - Create, edit, delete posts with images
- **Comments** - Nested comments with replies
- **Likes** - Like posts and comments
- **Follow System** - Follow/unfollow users
- **Notifications** - Real-time notifications
- **Blocking** - Block unwanted users
- **Billing** - Stripe integration for PRO subscriptions
- **Dark Mode** - Modern dark theme UI
- **Responsive** - Mobile-friendly design

## Tech Stack

- **Next.js 16** (App Router) - Full-stack framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS v4** - Styling
- **Prisma** - ORM (PostgreSQL)
- **Radix UI** - Accessible components
- **Framer Motion** - Animations
- **Stripe** - Payments
- **ImageKit** - Media storage

## Project Structure

```
.
├── prisma/                  # Database schema & seed
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Auth routes (login, register)
│   │   ├── (main)/          # Authenticated routes
│   │   └── api/v1/          # API Route Handlers
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components
│   │   └── ui/              # Radix UI primitives
│   ├── context/             # React context providers
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities (auth, errors, cache, etc.)
│   ├── services/            # API client & business logic
│   └── styles/              # Global styles & theme
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Stripe account (for billing)
- ImageKit account (for media uploads)

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd social-network
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## Environment Variables

See `.env.example` for all required variables.

## Deployment

Deploy to Vercel:
1. Push code to GitHub
2. Import in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy
