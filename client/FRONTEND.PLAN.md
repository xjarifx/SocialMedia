# 🎨 Social Media Frontend - Project Plan & Context

## 📋 Project Overview

Building a modern social media frontend application using React, TypeScript, and Tailwind CSS with Anthropic's elegant UI design system. This application interfaces with our custom social media API.

## 🎯 Design System - Anthropic Theme

### Color Palette

```css
/* Primary Colors - Anthropic Orange/Coral */
--primary-50: #fef7f0
--primary-100: #fdeee0
--primary-200: #fbd6ba
--primary-300: #f8ba85
--primary-400: #f49553
--primary-500: #f37125  /* Main brand color */
--primary-600: #e55a14
--primary-700: #c14612
--primary-800: #9b3812
--primary-900: #7e3012

/* Neutral Colors - Clean grays */
--neutral-50: #fafafa
--neutral-100: #f5f5f5
--neutral-200: #e5e5e5
--neutral-300: #d4d4d4
--neutral-400: #a3a3a3
--neutral-500: #737373
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717
--neutral-950: #0a0a0a

/* Accent Colors */
--blue: #2563eb
--green: #16a34a
--red: #dc2626
--yellow: #eab308
```

### Typography

- **Font Family**: Inter (clean, modern sans-serif)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400-500
- **Subtle text**: Font weight 300-400

### Design Principles

- ✨ Clean and minimal interface
- 🎯 Generous whitespace
- 📱 Mobile-first responsive design
- 🎨 Subtle shadows and rounded corners
- ⚡ Smooth micro-interactions
- 🔘 Soft, rounded buttons
- 📝 Clear typography hierarchy

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   ├── auth/            # Authentication components
│   ├── posts/           # Post-related components
│   ├── comments/        # Comment components
│   └── social/          # Social features (Follow, Like, etc.)
├── pages/               # Page components
│   ├── auth/            # Login, Register pages
│   ├── profile/         # User profile pages
│   ├── feed/            # Main feed page
│   └── search/          # Search page
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── api/                 # API integration layer
```

## 🎯 Implementation Roadmap

### Phase 1: Foundation & Authentication ✅

- [x] **1.1** Project structure setup
- [x] **1.2** Anthropic theme configuration
- [x] **1.3** Basic UI components (Button, Input, Card, Avatar, LoadingSpinner)
- [x] **1.4** Authentication context & hooks
- [x] **1.5** Login page
- [x] **1.6** Register page
- [x] **1.7** Protected route component
- [x] **1.8** React Router setup
- [x] **1.9** Basic homepage with navigation

### Phase 2: Core Features 🔄

- [ ] **2.1** Main layout with navigation
- [ ] **2.2** User profile page
- [ ] **2.3** Profile editing interface
- [ ] **2.4** Password change functionality
- [ ] **2.5** User feed/timeline
- [ ] **2.6** Post creation interface
- [ ] **2.7** Post display components

### Phase 3: Social Interactions 📋

- [ ] **3.1** Comment system
- [ ] **3.2** Like/unlike functionality
- [ ] **3.3** Follow/unfollow features
- [ ] **3.4** Followers/following lists
- [ ] **3.5** User search interface
- [ ] **3.6** Real-time updates (optimistic UI)

### Phase 4: Polish & Enhancement 📋

- [ ] **4.1** Loading states and skeletons
- [ ] **4.2** Error handling and user feedback
- [ ] **4.3** Mobile responsive optimizations
- [ ] **4.4** Accessibility improvements
- [ ] **4.5** Performance optimizations
- [ ] **4.6** Advanced animations

## 🔧 Technical Stack

### Core Technologies

- **Framework**: React 19+ with TypeScript
- **Styling**: Tailwind CSS v4+
- **Build Tool**: Vite
- **State Management**: React Context + Custom hooks
- **HTTP Client**: Fetch API with custom utilities

### Key Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "tailwindcss": "^4.1.13",
  "@tailwindcss/vite": "^4.1.13",
  "typescript": "~5.8.3"
}
```

## 🎨 Component Design Guidelines

### Button Component Variants

```tsx
// Primary button (Anthropic orange)
<Button variant="primary">Create Post</Button>

// Secondary button (neutral outline)
<Button variant="secondary">Cancel</Button>

// Ghost button (minimal)
<Button variant="ghost">Like</Button>
```

### Card Component

```tsx
<Card className="p-6 bg-white shadow-sm rounded-lg">{/* Content */}</Card>
```

### Form Components

- Clean, rounded input fields
- Subtle focus states
- Consistent spacing and typography
- Clear error states

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

## 🔒 Authentication Flow

1. **Initial Load**: Check for stored JWT token
2. **Login Process**: Authenticate → Store token → Redirect to feed
3. **Protected Routes**: Verify token before accessing
4. **Token Expiration**: Auto-redirect to login on 401 errors
5. **Logout**: Clear token and redirect to login

## 🔄 State Management Strategy

### Authentication Context

```tsx
interface AuthContext {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data) => Promise<void>;
}
```

### Custom Hooks

- `useAuth()` - Authentication state and actions
- `useApi()` - API requests with auth headers
- `usePosts()` - Post management
- `useComments()` - Comment operations
- `useLikes()` - Like/unlike actions

## 🎯 API Integration

### Base Configuration

```typescript
const API_BASE = "http://localhost:3000/api";

// Authenticated request helper
const apiClient = {
  get: (url: string) => authenticatedFetch(url, { method: "GET" }),
  post: (url: string, data: any) =>
    authenticatedFetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // ... other methods
};
```

### Error Handling Strategy

- Network errors: Show retry mechanism
- 401 Unauthorized: Redirect to login
- 400 Bad Request: Show field-specific errors
- 500 Server Error: Show generic error message

## 🎨 UI Components Checklist

### Base Components

- [ ] **Button** - Multiple variants (primary, secondary, ghost)
- [ ] **Input** - Text, email, password with validation states
- [ ] **Card** - Container component with shadow
- [ ] **Avatar** - User profile pictures
- [ ] **Badge** - Status indicators
- [ ] **Modal** - Overlay dialogs
- [ ] **Dropdown** - Menu component
- [ ] **Loading** - Spinner and skeleton states

### Layout Components

- [ ] **Header** - Main navigation bar
- [ ] **Sidebar** - Navigation menu (desktop)
- [ ] **Layout** - Page wrapper with consistent spacing
- [ ] **Container** - Content width container

### Feature Components

- [ ] **PostCard** - Individual post display
- [ ] **CommentItem** - Single comment component
- [ ] **UserCard** - User profile preview
- [ ] **SearchBar** - Search input with results
- [ ] **FollowButton** - Follow/unfollow toggle

## 🚀 Performance Considerations

### Optimization Strategies

- **Code Splitting**: Lazy load pages with React.lazy()
- **Image Optimization**: Lazy loading for user avatars/posts
- **Virtual Scrolling**: For long feeds/lists
- **Debounced Search**: Reduce API calls
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: Store frequently accessed data

### Bundle Size Monitoring

- Keep bundle under 250KB gzipped
- Tree-shake unused Tailwind classes
- Use dynamic imports for large features

## 🔍 Testing Strategy

### Component Testing

- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for user flows

### Manual Testing Checklist

- [ ] Authentication flow works correctly
- [ ] All forms validate properly
- [ ] Responsive design on all screen sizes
- [ ] Error states display correctly
- [ ] Loading states show appropriately

## 🎉 Success Metrics

### User Experience

- Fast loading times (< 2s initial load)
- Smooth interactions (60 FPS animations)
- Intuitive navigation flow
- Accessible to all users (WCAG compliance)

### Technical Goals

- TypeScript strict mode with no errors
- 90+ Lighthouse performance score
- Zero console errors in production
- Clean, maintainable code architecture

## 🤝 Collaboration Guidelines

### For Team Members

1. **Before Starting**: Read this document and API guide
2. **Implementation**: Check off completed items in roadmap
3. **Code Style**: Follow existing patterns and TypeScript conventions
4. **Testing**: Test on multiple screen sizes before marking complete
5. **Updates**: Keep this document updated with any architectural changes

### For AI Assistants

- Always check roadmap status before starting work
- Update completion status when finishing components
- Follow established design patterns and naming conventions
- Prioritize user experience and code quality
- Ask for clarification if requirements are unclear

---

**Last Updated**: September 29, 2025  
**Status**: Phase 1 completed ✅ - Ready for Phase 2  
**Next Priority**: User profile management and core feed features
