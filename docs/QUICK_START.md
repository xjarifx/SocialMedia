# Quick Start Guide - Twitter/X Clone

## 🚀 Running the Application

### Start the Development Server

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

### Start the Backend Server (if needed)

```bash
cd server
npm run dev
```

## 🎨 Key Components Reference

### Layout Components

#### `<AppLayout>`

Main layout wrapper with sidebars and mobile navigation.

- Automatically shows/hides sidebars based on screen size
- Includes bottom nav and floating post button on mobile

#### `<BottomNavigation>`

Mobile-only bottom navigation bar with 4 items:

- Home, Explore, Notifications, Messages
- Active state highlighting
- Fixed at bottom with z-index 50

#### `<FloatingPostButton>`

Animated FAB (Floating Action Button) for creating posts on mobile.

- Only visible on mobile (hidden on md+)
- Smooth scale animations
- Positioned bottom-right above bottom nav

### UI Components

#### `<Badge>`

Display counts and status indicators.

```tsx
<Badge variant="primary" size="sm">New</Badge>
<Badge variant="danger">3</Badge>
```

**Props:**

- `variant`: "primary" | "secondary" | "danger" | "success"
- `size`: "sm" | "md" | "lg"

#### `<Tabs>`

Tab navigation with two variants.

```tsx
<Tabs
  tabs={[{ id: "all", label: "All" }]}
  activeTab="all"
  onChange={setActiveTab}
  variant="default" // or "pills"
/>
```

#### `<Modal>`

Full-featured modal with animations.

```tsx
<Modal isOpen={isOpen} onClose={close} size="md">
  <ModalHeader onClose={close}>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={close}>Cancel</Button>
  </ModalFooter>
</Modal>
```

**Sizes:** "sm" | "md" | "lg" | "xl" | "full"

#### `<Toast>`

Global notification system.

```tsx
import { useToast } from "./components/ui/Toast";

function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast("Success!", "success", 3000);
  };
}
```

**Types:** "success" | "error" | "warning" | "info"

#### `<Skeleton>`

Loading placeholders.

```tsx
import Skeleton, { PostSkeleton, ProfileSkeleton } from './components/ui/Skeleton';

<PostSkeleton /> // For posts
<ProfileSkeleton /> // For profiles
<Skeleton variant="circular" width={40} height={40} /> // Custom
```

### Post Components

#### `<PostCard>`

Enhanced post card with all interactions.

```tsx
<PostCard
  post={{
    id: 1,
    username: "user",
    content: "Hello world!",
    createdAt: "2024-01-01T00:00:00Z",
    likes: 42,
    comments: 5,
    reposts: 3,
    isLiked: false,
    isReposted: false,
    media: ["url1.jpg", "url2.jpg"], // optional
    views: 1234, // optional
  }}
  onLike={() => handleLike(1)}
  onRepost={() => handleRepost(1)} // optional
  onClick={() => handleClick(1)} // optional
/>
```

**Features:**

- Animated like (scale pulse)
- Animated repost (rotate)
- Media grid (1-4 images)
- Formatted numbers (1.2K)
- View counts
- Hover states

#### `<PostComposer>`

Advanced post creation form.

```tsx
<PostComposer />
```

**Features:**

- Auto-expanding textarea
- 280 character limit with circular progress
- Media upload (up to 4 images)
- Media preview with remove button
- Toast notifications
- Disabled states

#### `<PostFeed>`

Feed of posts with loading states.

```tsx
<PostFeed activeTab="for-you" />
```

**Active Tab:** "for-you" | "following"

## 🎯 Utility Functions

### Format Numbers

```tsx
import { formatNumber } from "./utils/format";

formatNumber(1234); // "1.2K"
formatNumber(1234567); // "1.2M"
formatNumber(42); // "42"
```

### Debounce

```tsx
import { debounce } from "./utils/format";

const debouncedSearch = debounce((query) => {
  // API call
}, 300);
```

### Throttle

```tsx
import { throttle } from "./utils/format";

const throttledScroll = throttle(() => {
  // Handle scroll
}, 100);
```

### Format Dates

```tsx
import { formatDateDisplay } from "./utils/time";

formatDateDisplay("2024-01-01T00:00:00Z");
// Returns: "2h" | "Jan 1" | "Jan 1, 2023" (based on recency)
```

## 🎨 Styling Guide

### Colors (Tailwind Classes)

- **Primary Blue**: `bg-primary-500`, `text-primary-500`
- **Background**: `bg-black`, `bg-neutral-900`
- **Borders**: `border-neutral-800`
- **Text**: `text-white`, `text-neutral-500`
- **Like Pink**: `text-pink-600`
- **Repost Green**: `text-green-500`

### Common Patterns

#### Hover Button

```tsx
<button className="p-2 rounded-full hover:bg-neutral-800 transition-colors">
  {/* icon */}
</button>
```

#### Action Button (like Twitter)

```tsx
<button className="flex items-center space-x-1 group">
  <div className="p-2 rounded-full group-hover:bg-primary-500/10 transition-colors">
    <svg className="w-5 h-5 text-neutral-500 group-hover:text-primary-500">
      {/* icon */}
    </svg>
  </div>
  <span className="text-xs text-neutral-500 group-hover:text-primary-500">
    {count}
  </span>
</button>
```

#### Sticky Header

```tsx
<div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10">
  {/* header content */}
</div>
```

## 🔧 Common Tasks

### Add a New Page

1. Create page in `src/pages/`
2. Add route in `App.tsx`
3. Add navigation item in `Sidebar.tsx` or `BottomNavigation.tsx`

### Add Toast Notification

```tsx
import { useToast } from "../components/ui/Toast";

const { showToast } = useToast();

// Success
showToast("Post created!", "success");

// Error
showToast("Something went wrong", "error");

// Warning
showToast("Character limit exceeded", "warning");

// Info
showToast("New updates available", "info");
```

### Add Modal

```tsx
import { useState } from "react";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../components/ui/Modal";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader onClose={() => setIsOpen(false)}>My Modal</ModalHeader>
        <ModalBody>Content goes here</ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Use React Query

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";

function MyComponent() {
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "for-you"],
    queryFn: () => api.getForYouPosts(),
  });

  // Mutate data
  const mutation = useMutation({
    mutationFn: (postId) => api.likePost(postId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return <div>...</div>;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px` (md)
- **Tablet**: `768px - 1024px` (md - lg)
- **Desktop**: `> 1024px` (lg+)

### Conditional Rendering

```tsx
{
  /* Show on mobile only */
}
<div className="md:hidden">Mobile content</div>;

{
  /* Hide on mobile */
}
<div className="hidden md:block">Desktop content</div>;

{
  /* Show on large screens only */
}
<div className="hidden lg:block">Large screen content</div>;
```

## 🎭 Animation Examples

### Framer Motion Scale

```tsx
import { motion } from "framer-motion";

<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>;
```

### Framer Motion Slide

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  Content
</motion.div>
```

### CSS Transitions

```tsx
<div className="transition-all duration-300 ease-in-out hover:bg-neutral-800">
  Hover me
</div>
```

## 🐛 Debugging Tips

1. **Check React Query DevTools** (if installed):

   ```tsx
   import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

   <ReactQueryDevtools initialIsOpen={false} />;
   ```

2. **Check Toast Messages**: They appear bottom-right

3. **Check Console**: All errors logged to console

4. **Check Network Tab**: API calls visible in DevTools

## 🎯 Best Practices

1. **Always use TypeScript types**
2. **Use semantic HTML** (nav, main, article, etc.)
3. **Add ARIA labels** to icon-only buttons
4. **Use formatNumber** for all counts
5. **Use formatDateDisplay** for all dates
6. **Wrap API calls in try-catch**
7. **Show loading states** with Skeleton
8. **Show empty states** with helpful messages
9. **Use Toast** for user feedback
10. **Keep components small** and focused

## 📚 Additional Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **React Query Docs**: https://tanstack.com/query/latest
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Twitter Design System**: Study twitter.com for inspiration

## 🎉 You're Ready!

Start building amazing features on top of this solid foundation. The app is production-ready and waiting for your creativity!
