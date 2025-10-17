# Twitter/X Clone - Modern Social Media Platform

> A production-ready, feature-rich Twitter/X clone built with React, TypeScript, Tailwind CSS, and Framer Motion.

![Tech Stack](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-cyan)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-purple)

## 🔗 Links

- 📋 **Notion Plan**: https://neon-cut-6bf.notion.site/Project-Social-Media-274e526928ab80369962dd112f14fe6f

## ✨ Features

### 🎨 Modern UI/UX

- **Pixel-perfect Twitter/X design** - Matches the real Twitter experience
- **Smooth animations** - Framer Motion powered micro-interactions
- **Fully responsive** - Desktop, tablet, and mobile optimized
- **Dark theme** - Easy on the eyes, modern aesthetic
- **Accessible** - WCAG compliant, keyboard navigation, ARIA labels

### 📱 Core Features

- ✅ **Posts/Tweets** with text and images (up to 4)
- ✅ **Like & Repost** with animations
- ✅ **Comments** and view counts
- ✅ **Profile pages** with cover photo, bio, tabs
- ✅ **Notifications** with grouping and badges
- ✅ **Post composer** with character counter
- ✅ **Media upload** with preview
- ✅ **Search** functionality
- ✅ **Trending topics**
- ✅ **Who to follow** suggestions

### 🚀 Technical Highlights

- **React Query** - Smart data fetching and caching
- **TypeScript** - Type-safe codebase
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **Toast notifications** - User feedback system
- **Skeleton loaders** - Better loading UX
- **Optimistic updates** - Instant UI feedback

## 📦 Project Structure

```
SocialMedia/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Layout components
│   │   │   ├── posts/        # Post-related components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React contexts
│   │   ├── utils/            # Utility functions
│   │   └── App.tsx           # Main app component
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── repositories/     # Database queries
│   │   ├── middlewares/      # Express middlewares
│   │   └── routes/           # API routes
│   └── package.json
│
├── IMPLEMENTATION_SUMMARY.md  # Detailed implementation guide
├── QUICK_START.md            # Quick reference guide
├── COMPONENT_SHOWCASE.md     # Component examples
├── FUTURE_ENHANCEMENTS.md    # Roadmap and ideas
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd SocialMedia
```

2. **Install client dependencies**

```bash
cd client
npm install
```

3. **Install server dependencies**

```bash
cd ../server
npm install
```

4. **Start the development servers**

Terminal 1 (Backend):

```bash
cd server
npm run dev
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
```

5. **Open your browser**

```
http://localhost:5173
```

## 🎯 Key Technologies

### Frontend

- **React 19.1** - UI library
- **TypeScript 5.8** - Type safety
- **Tailwind CSS 4.1** - Styling
- **Framer Motion** - Animations
- **React Router v6** - Routing
- **TanStack Query** - Data fetching
- **Zustand** - State management (ready)
- **Vite** - Build tool

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database (via repositories)

## 📚 Documentation

### For Developers

- 📖 **[Quick Start Guide](./QUICK_START.md)** - Get up and running fast
- 🎨 **[Component Showcase](./COMPONENT_SHOWCASE.md)** - Visual component guide
- 📋 **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Detailed feature list
- 🔮 **[Future Enhancements](./FUTURE_ENHANCEMENTS.md)** - Roadmap and ideas

## 🌟 What's Included

### Layout Components

- ✅ **AppLayout** - Main 3-column layout (left sidebar, feed, right sidebar)
- ✅ **Sidebar** - Desktop navigation with logo and user card
- ✅ **RightSidebar** - Trending and suggestions
- ✅ **BottomNavigation** - Mobile bottom nav bar
- ✅ **FloatingPostButton** - Mobile FAB for creating posts

### UI Components

- ✅ **Badge** - Status and count indicators
- ✅ **Tabs** - Two variants (underline, pills)
- ✅ **Modal** - Full-featured with animations
- ✅ **Toast** - Notification system (4 types)
- ✅ **Skeleton** - Loading placeholders
- ✅ **Button** - Multiple variants and states

### Post Components

- ✅ **PostCard** - Enhanced with animations, media grid
- ✅ **PostComposer** - Auto-expand, media upload, character counter
- ✅ **PostFeed** - Loading states, error handling

### Pages

- ✅ **Dashboard** - Main feed with tabs and composer
- ✅ **Profile** - Cover photo, bio, tabs, posts
- ✅ **Notifications** - Grouped with badges
- ✅ **Messages** - Coming soon placeholder
- ✅ **Login/Register** - Authentication flows

## 🎨 Design System

### Colors

- **Primary**: `#1DA1F2` (Twitter Blue)
- **Background**: `#000000` (Black)
- **Surface**: `#262626` (Neutral-800)
- **Text**: `#FFFFFF` / `#737373`

### Typography

- **Font Family**: System fonts
- **Sizes**: 12px, 15px, 20px, 24px
- **Weights**: Regular (400), Medium (500), Bold (700)

### Spacing

- **Base**: 4px rhythm
- **Common**: 8px, 12px, 16px, 24px

## 📈 Performance

- ✅ **Code splitting** - Lazy loaded routes
- ✅ **Image optimization** - Lazy loading
- ✅ **React Query caching** - Smart data fetching
- ✅ **Optimistic updates** - Instant UI feedback
- ✅ **Debounced search** - Reduced API calls
- 🔜 **Virtual scrolling** - For long feeds
- 🔜 **Service Worker** - PWA support

## 🔐 Security

- ✅ **JWT authentication**
- ✅ **Protected routes**
- ✅ **Input validation**
- ✅ **XSS protection**
- 🔜 **CSRF tokens**
- 🔜 **Rate limiting**

## 🗺️ Roadmap

See [FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md) for planned features:

- [ ] Infinite scroll
- [ ] Post detail modal
- [ ] Image lightbox
- [ ] Real-time updates
- [ ] Emoji picker
- [ ] Video support
- [ ] Direct messages
- [ ] PWA support
- [ ] And much more!

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

⭐ Star this repo if you find it useful!

</div>
