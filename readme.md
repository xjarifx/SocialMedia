# 🌐 Social Media Platform

A modern, full-stack social media application built with React, TypeScript, Node.js, and PostgreSQL. Features include posts with media uploads, comments, likes, follows, and user profiles.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.8.3-blue.svg)
![React](https://img.shields.io/badge/react-%5E19.1.1-61dafb.svg)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Architecture](#-architecture)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features

- 🔐 **User Authentication** - JWT-based login and registration
- 👤 **User Profiles** - Customizable profiles with avatar uploads
- 📝 **Posts** - Create, edit, and delete posts with text and media
- 🖼️ **Media Upload** - Support for images and videos via Cloudinary
- 💬 **Comments** - Comment on posts with nested discussions
- ❤️ **Likes** - Like posts and see engagement counts
- 👥 **Social Features** - Follow/unfollow users, view followers/following
- 🔒 **Privacy Controls** - Public/private account settings
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🎨 **Modern UI** - Clean, Anthropic-inspired design system

### Coming Soon

- 🔔 Notifications system
- 🔍 Search functionality
- 🔄 Password reset flow
- 💬 Direct messaging
- 📊 User analytics

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **State Management**: React Context + Zustand
- **HTTP Client**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Animations**: Framer Motion

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Password Security**: bcrypt
- **Environment**: dotenv

### DevOps & Tools

- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript strict mode
- **API Testing**: Postman/Thunder Client

---

## 📂 Project Structure

```
SocialMedia/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Base components (Button, Input, Card)
│   │   │   ├── layout/   # Layout components (Sidebar, Header)
│   │   │   └── posts/    # Post-related components
│   │   ├── pages/        # Page components
│   │   │   ├── auth/     # Login, Register
│   │   │   └── profile/  # Profile pages
│   │   ├── context/      # React contexts (Auth, Theme)
│   │   ├── utils/        # Utility functions
│   │   └── main.tsx      # App entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration (Cloudinary)
│   │   ├── controllers/  # Request handlers
│   │   ├── db/           # Database connection
│   │   ├── middlewares/  # Express middleware (auth, upload)
│   │   ├── repositories/ # Data access layer
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   ├── utils/        # Utility functions
│   │   └── server.ts     # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                  # Documentation
│   ├── backend-overview.md
│   ├── database-schema.md
│   └── simple-credentials.md
│
└── readme.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **npm** or **yarn**
- **Cloudinary Account** (for media uploads)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/xjarifx/SocialMedia.git
cd SocialMedia
```

#### 2. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

#### 3. Set Up Database

Create a PostgreSQL database:

```sql
CREATE DATABASE socialmedia;
```

Run the database schema:

```bash
psql -U your_username -d socialmedia -f docs/database-schema.sql
```

Or manually create tables using the schema in `docs/database-schema.md`.

#### 4. Configure Environment Variables

**Backend** - Create `server/.env`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/socialmedia

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
NODE_ENV=development
```

**Frontend** - Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 5. Run the Application

**Backend** (Terminal 1):

```bash
cd server
npm run dev
```

Server runs on `http://localhost:3000`

**Frontend** (Terminal 2):

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`

#### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

### Quick Test Credentials

See `docs/simple-credentials.md` for test accounts.

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### Authentication

| Method | Endpoint    | Description   | Auth Required |
| ------ | ----------- | ------------- | ------------- |
| POST   | `/register` | Register user | No            |
| POST   | `/login`    | Login user    | No            |

#### User Profile

| Method | Endpoint           | Description      | Auth Required |
| ------ | ------------------ | ---------------- | ------------- |
| GET    | `/profile`         | Get own profile  | Yes           |
| PUT    | `/profile`         | Update profile   | Yes           |
| PUT    | `/password`        | Change password  | Yes           |
| GET    | `/users/:username` | Get user profile | Yes           |

#### Social Features

| Method | Endpoint                   | Description         | Auth Required |
| ------ | -------------------------- | ------------------- | ------------- |
| POST   | `/:username/follow`        | Follow user         | Yes           |
| DELETE | `/:username/unfollow`      | Unfollow user       | Yes           |
| GET    | `/:username/follow-status` | Check follow status | Yes           |
| GET    | `/followers`               | Get followers       | Yes           |
| GET    | `/following`               | Get following       | Yes           |

#### Posts

| Method | Endpoint                | Description    | Auth Required |
| ------ | ----------------------- | -------------- | ------------- |
| GET    | `/posts/feed`           | Get newsfeed   | Yes           |
| POST   | `/posts`                | Create post    | Yes           |
| PUT    | `/posts/:postId`        | Update post    | Yes           |
| DELETE | `/posts/:postId`        | Delete post    | Yes           |
| GET    | `/posts/user/:username` | Get user posts | Yes           |

#### Engagement

| Method | Endpoint                  | Description    | Auth Required |
| ------ | ------------------------- | -------------- | ------------- |
| POST   | `/posts/:postId/like`     | Like post      | Yes           |
| DELETE | `/posts/:postId/unlike`   | Unlike post    | Yes           |
| GET    | `/posts/:postId/comments` | Get comments   | Yes           |
| POST   | `/posts/:postId/comments` | Add comment    | Yes           |
| DELETE | `/comments/:commentId`    | Delete comment | Yes           |

### Detailed API Examples

#### Register User

```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "avatar_url": null,
    "bio": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Create Post with Media

```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

content: "Beautiful sunset today! 🌅"
media: [file1.jpg, file2.jpg]
```

**Response:**

```json
{
  "id": 123,
  "content": "Beautiful sunset today! 🌅",
  "media_url": [
    "https://res.cloudinary.com/.../image1.jpg",
    "https://res.cloudinary.com/.../image2.jpg"
  ],
  "user_id": 1,
  "created_at": "2025-11-20T10:30:00.000Z"
}
```

For complete API documentation, see `docs/backend-overview.md`.

---

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts and profiles
- **posts** - User posts with media
- **comments** - Post comments
- **likes** - Post likes
- **followers** - Follow relationships

### Key Relationships

- Users → Posts (1:N)
- Users → Comments (1:N)
- Posts → Comments (1:N)
- Posts → Likes (1:N)
- Users → Followers (N:N)

### Example Query

```sql
-- Get user's feed (posts from followed users)
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
  SELECT followed_id FROM followers WHERE follower_id = $1
)
ORDER BY p.created_at DESC;
```

For complete schema details, see `docs/database-schema.md`.

---

## 🏗️ Architecture

### Backend Architecture

**Repository Pattern** with layered architecture:

```
Request → Routes → Controllers → Repositories → Database
                      ↓
                  Services (Cloudinary, etc.)
```

**Key Design Decisions:**

- **Repository Pattern**: Separates data access from business logic
- **Middleware Pipeline**: Modular request processing
- **JWT Authentication**: Stateless, scalable auth
- **Cloud Storage**: Offload media to Cloudinary

### Frontend Architecture

**Component-based architecture** with context for state:

```
Pages → Layout → Feature Components → UI Components
           ↓
     Context Providers (Auth, Theme)
           ↓
     Custom Hooks (useAuth, useApi)
```

**Key Design Decisions:**

- **Context API**: Global state for auth and theme
- **Custom Hooks**: Reusable logic abstraction
- **Composition**: Build complex UIs from simple components
- **Mobile-First**: Responsive design from the ground up

### Security Measures

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication (24-hour expiration)
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration for frontend origin
- ✅ Authorization checks on protected routes
- ✅ Secure file uploads to Cloudinary

---

## 💻 Development

### Running in Development Mode

**Backend with hot reload:**

```bash
cd server
npm run dev  # Uses tsx --watch
```

**Frontend with hot reload:**

```bash
cd client
npm run dev  # Uses Vite
```

### Building for Production

**Backend:**

```bash
cd server
npm run build  # Compiles TypeScript
npm start      # Runs compiled JS
```

**Frontend:**

```bash
cd client
npm run build  # Creates optimized production build
npm run preview # Preview production build
```

### Code Quality

**Run linter:**

```bash
cd client
npm run lint
```

**Type checking:**

```bash
# Backend
cd server
npx tsc --noEmit

# Frontend
cd client
npx tsc --noEmit
```

### Development Best Practices

1. **Branching**: Create feature branches from `master`
2. **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
3. **Testing**: Test on multiple screen sizes
4. **TypeScript**: Maintain strict mode compliance
5. **Code Style**: Follow existing patterns and conventions

---

## 📦 Deployment

### Prerequisites for Production

- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set up Cloudinary production environment
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform

### Recommended Hosting

**Backend:**

- **Render** - Free tier available
- **Railway** - Easy PostgreSQL integration
- **Heroku** - Classic platform
- **DigitalOcean** - VPS option

**Frontend:**

- **Vercel** - Optimized for React
- **Netlify** - Easy deployment
- **Cloudflare Pages** - Global CDN

**Database:**

- **Neon** - Serverless PostgreSQL
- **Supabase** - PostgreSQL with extras
- **Railway** - Managed PostgreSQL

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API base URL updated in frontend
- [ ] CORS configured for production domain
- [ ] SSL/HTTPS enabled
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Monitoring enabled
- [ ] Backup strategy in place

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Convention

```
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting, etc.)
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks
```

### Code Style

- Follow existing TypeScript and React patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain type safety (no `any` types)
- Write responsive, accessible code

### Pull Request Process

1. Update documentation if needed
2. Ensure all TypeScript compiles without errors
3. Test on multiple browsers and screen sizes
4. Request review from maintainers
5. Address review feedback

---

## 📝 Additional Documentation

- **Backend Overview**: `docs/backend-overview.md` - Comprehensive backend documentation
- **Database Schema**: `docs/database-schema.md` - Complete database structure
- **Frontend Plan**: `client/FRONTEND-PLAN.md` - Frontend roadmap and design system
- **Test Credentials**: `docs/simple-credentials.md` - Development test accounts

---

## 🐛 Known Issues & Limitations

- ⚠️ No automated tests (high priority to add)
- ⚠️ No request validation library (manual validation only)
- ⚠️ No pagination on list endpoints
- ⚠️ No rate limiting on API
- ⚠️ Notifications system not yet implemented
- ⚠️ Password reset flow not yet implemented
- ⚠️ Search functionality not yet implemented

See `docs/backend-overview.md` for complete technical debt and improvement roadmap.

---

## 🗺️ Roadmap

### Q1 2026

- [ ] Add automated testing (Jest, React Testing Library)
- [ ] Implement request validation (Zod)
- [ ] Add pagination to all list endpoints
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger)

### Q2 2026

- [ ] Notifications system
- [ ] Password reset flow
- [ ] Search functionality (users, posts, hashtags)
- [ ] Direct messaging
- [ ] Email verification

### Q3 2026

- [ ] Performance optimization (caching, CDN)
- [ ] Real-time features (WebSockets)
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **xjarifx** - Initial work - [GitHub](https://github.com/xjarifx)

---

## 🙏 Acknowledgments

- Design inspiration from Anthropic's UI
- Community libraries and open-source tools
- All contributors and supporters

---

## 📧 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/xjarifx/SocialMedia/issues)
- **Email**: [Contact for questions]
- **Documentation**: Check `docs/` folder for detailed guides

---

## ⭐ Star This Project

If you find this project helpful, please consider giving it a star on GitHub!

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
