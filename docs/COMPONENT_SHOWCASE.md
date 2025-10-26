# Component Showcase

Visual guide to all available components and their usage.

## 🎨 UI Components

### Badge

```tsx
import Badge from './components/ui/Badge';

// Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="success">Success</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Use cases
<Badge variant="danger">3</Badge> // Notification count
<Badge variant="primary" size="sm">New</Badge> // Status indicator
<Badge variant="success">✓ Verified</Badge> // Verification badge
```

**Preview:**

```
[Primary] [Secondary] [Danger] [Success]
[Small] [Medium] [Large]
```

---

### Tabs

```tsx
import Tabs from './components/ui/Tabs';

// Default variant (underline)
<Tabs
  tabs={[
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified' },
    { id: 'mentions', label: 'Mentions' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="default"
/>

// Pills variant
<Tabs
  tabs={[
    { id: 'posts', label: 'Posts' },
    { id: 'media', label: 'Media' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="pills"
/>
```

**Preview:**

```
Default: [All] ___  Verified  Mentions

Pills:   (Posts)  Media
```

---

### Modal

```tsx
import Modal, { ModalHeader, ModalBody, ModalFooter } from './components/ui/Modal';

// Basic
<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader onClose={close}>Title</ModalHeader>
  <ModalBody>
    <p>Modal content goes here</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={close}>Cancel</Button>
    <Button onClick={handleSave}>Save</Button>
  </ModalFooter>
</Modal>

// Sizes
<Modal size="sm">Small Modal</Modal>
<Modal size="md">Medium Modal (default)</Modal>
<Modal size="lg">Large Modal</Modal>
<Modal size="xl">Extra Large Modal</Modal>
<Modal size="full">Fullscreen Modal</Modal>
```

**Features:**

- ✅ Backdrop click to close
- ✅ Escape key to close
- ✅ Scroll lock on body
- ✅ Smooth animations (fade + scale + slide)
- ✅ Focus management
- ✅ Accessible (ARIA)

---

### Toast

```tsx
import { useToast } from "./components/ui/Toast";

function MyComponent() {
  const { showToast } = useToast();

  return (
    <>
      <button onClick={() => showToast("Success!", "success")}>
        Show Success
      </button>
      <button onClick={() => showToast("Error!", "error")}>Show Error</button>
      <button onClick={() => showToast("Warning!", "warning")}>
        Show Warning
      </button>
      <button onClick={() => showToast("Info", "info")}>Show Info</button>
    </>
  );
}
```

**Preview:**

```
┌─────────────────────────┐
│ ✓ Success message       │ (green)
└─────────────────────────┘

┌─────────────────────────┐
│ ✕ Error message         │ (red)
└─────────────────────────┘

┌─────────────────────────┐
│ ⚠ Warning message       │ (yellow)
└─────────────────────────┘

┌─────────────────────────┐
│ ℹ Info message          │ (blue)
└─────────────────────────┘
```

**Features:**

- ✅ Auto-dismiss after duration
- ✅ Manual close button
- ✅ Slide-in animation
- ✅ Stacks multiple toasts
- ✅ Bottom-right positioning

---

### Skeleton

```tsx
import Skeleton, { PostSkeleton, ProfileSkeleton } from './components/ui/Skeleton';

// Custom skeleton
<Skeleton variant="text" width="80%" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height={200} />

// Pre-built skeletons
<PostSkeleton /> // For post cards
<ProfileSkeleton /> // For profile pages

// Loading state
{isLoading ? (
  <>
    <PostSkeleton />
    <PostSkeleton />
    <PostSkeleton />
  </>
) : (
  posts.map(post => <PostCard {...post} />)
)}
```

**Preview:**

```
PostSkeleton:
┌────────────────────────┐
│ ⚪ ▬▬▬▬▬▬              │
│    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬     │
│    ▬▬▬▬▬▬▬▬▬▬         │
│    ⚪ ⚪ ⚪             │
└────────────────────────┘

ProfileSkeleton:
┌────────────────────────┐
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬    │ (cover)
│   ⚫                    │ (avatar)
│ ▬▬▬▬▬▬                 │ (name)
│ ▬▬▬▬▬▬▬▬▬▬▬▬           │ (bio)
└────────────────────────┘
```

---

### Button

```tsx
import Button from './components/ui/Button';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>

// States
<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button>
  <svg>...</svg>
  Follow
</Button>
```

---

## 📱 Post Components

### PostCard

```tsx
import PostCard from "./components/posts/PostCard";

<PostCard
  post={{
    id: 1,
    username: "techguru",
    content: "Just launched my new project! 🚀\n\nCheck it out at example.com",
    createdAt: "2024-01-15T12:00:00Z",
    likes: 1234,
    comments: 56,
    reposts: 78,
    isLiked: false,
    isReposted: false,
    views: 12345,
    media: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  }}
  onLike={() => handleLike(1)}
  onRepost={() => handleRepost(1)}
  onClick={() => handleClick(1)}
/>;
```

**Preview:**

```
┌─────────────────────────────────────┐
│ ⚫ techguru @techguru · 2h      ⋮  │
│                                      │
│ Just launched my new project! 🚀    │
│ Check it out at example.com          │
│                                      │
│ ┌─────────┬─────────┐               │
│ │ [img 1] │ [img 2] │               │
│ └─────────┴─────────┘               │
│                                      │
│ 💬 56   🔁 78   ❤️ 1.2K   📊 12K  ↗ │
└─────────────────────────────────────┘
```

**Features:**

- ✅ Animated like (scale pulse)
- ✅ Animated repost (rotate)
- ✅ Media grid (1-4 images)
- ✅ Formatted numbers (1.2K)
- ✅ Hover states
- ✅ Three-dot menu
- ✅ Clickable for detail view

**Media Grid Layouts:**

```
1 image:        2 images:       3 images:       4 images:
┌─────────┐     ┌────┬────┐     ┌────┬──┐       ┌────┬────┐
│         │     │    │    │     │    │  │       │    │    │
│  Full   │     │    │    │     │    ├──┤       ├────┼────┤
│         │     │    │    │     │    │  │       │    │    │
└─────────┘     └────┴────┘     └────┴──┘       └────┴────┘
```

---

### PostComposer

```tsx
import PostComposer from "./components/posts/PostComposer";

// Simple usage
<PostComposer />;

// That's it! Includes:
// - Auto-expanding textarea
// - Character counter
// - Media upload
// - Emoji, GIF, Poll buttons
// - Post button
```

**Preview:**

```
┌─────────────────────────────────────┐
│ ⚫ What is happening?!               │
│    ________________________          │
│    ________________________          │
│    ________________________          │
│                                      │
│ [📷] [😊] [GIF] [📊] [📅]    (280)  [Post] │
└─────────────────────────────────────┘

With media:
┌─────────────────────────────────────┐
│ ⚫ Check out these photos!           │
│                                      │
│ ┌────────┬────────┐                 │
│ │ img ✕  │ img ✕  │                 │
│ └────────┴────────┘                 │
│                                      │
│ [📷] [😊] [GIF] [📊] [📅]    ⭕ 245  [Post] │
└─────────────────────────────────────┘
         Character counter (red < 20)
```

**Features:**

- ✅ Auto-expand on typing
- ✅ 280 char limit with visual indicator
- ✅ Circular progress (turns red when close to limit)
- ✅ Media upload (up to 4 images)
- ✅ Media preview with remove button
- ✅ Toast notifications
- ✅ Disabled when empty or over limit

---

### PostFeed

```tsx
import PostFeed from './components/posts/PostFeed';

// For You feed
<PostFeed activeTab="for-you" />

// Following feed
<PostFeed activeTab="following" />
```

**Features:**

- ✅ Loading skeletons
- ✅ Error handling
- ✅ Empty states
- ✅ Smooth transitions

---

## 🎭 Layout Components

### AppLayout

```tsx
import AppLayout from "./components/layout/AppLayout";

<AppLayout>
  <YourPageContent />
</AppLayout>;
```

**Structure:**

```
┌──────────┬──────────────┬──────────┐
│          │              │          │
│  Left    │    Main      │  Right   │
│ Sidebar  │   Content    │ Sidebar  │
│ (275px)  │   (600px)    │ (350px)  │
│          │              │          │
│          │              │          │
└──────────┴──────────────┴──────────┘

Mobile:
┌────────────────────────┐
│                        │
│    Main Content        │
│     (full width)       │
│                        │
│                        │
└────────────────────────┘
┌────────────────────────┐
│  🏠  🔍  🔔  ✉️        │ Bottom Nav
└────────────────────────┘
           (+) FAB
```

---

### Sidebar (Desktop Left)

```tsx
import Sidebar from "./components/layout/Sidebar";

// Automatically included in AppLayout
```

**Features:**

- ✅ X logo at top
- ✅ Navigation items with icons
- ✅ Active state highlighting
- ✅ Large Post button
- ✅ User profile card at bottom

---

### RightSidebar (Desktop)

```tsx
import RightSidebar from "./components/layout/RightSidebar";

// Automatically included in AppLayout
```

**Features:**

- ✅ Search bar
- ✅ "What's happening" trending topics
- ✅ "Who to follow" suggestions
- ✅ Show more buttons

---

### BottomNavigation (Mobile)

```tsx
import BottomNavigation from "./components/layout/BottomNavigation";

// Automatically included in AppLayout
```

**Items:**

- 🏠 Home
- 🔍 Explore
- 🔔 Notifications
- ✉️ Messages

---

### FloatingPostButton (Mobile)

```tsx
import FloatingPostButton from "./components/layout/FloatingPostButton";

// Automatically included in AppLayout
```

**Features:**

- ✅ Only visible on mobile
- ✅ Smooth scale animations
- ✅ Positioned bottom-right
- ✅ Above bottom navigation

---

## 📄 Pages

### DashboardPage

```tsx
// Main feed with tabs and composer
┌────────────────────────┐
│ For you | Following     │ Tabs
├────────────────────────┤
│ ⚫ What is happening?! │ Composer
├────────────────────────┤
│ ⚫ Post 1              │
├────────────────────────┤
│ ⚫ Post 2              │
├────────────────────────┤
│ ⚫ Post 3              │
└────────────────────────┘
```

---

### ProfilePage

```tsx
// Full-featured profile
┌────────────────────────┐
│ ← Username     3 posts │ Header
├────────────────────────┤
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ │ Cover
│        ⚫              │ Avatar
│        Edit profile    │ Button
│                        │
│ Username               │
│ @username              │
│ Bio text here          │
│ 📅 Joined Jan 2024    │
│ 0 Following 0 Followers│
├────────────────────────┤
│Posts Replies Media Likes│ Tabs
├────────────────────────┤
│ ⚫ Post 1              │
└────────────────────────┘
```

---

### NotificationsPage

```tsx
// Notifications with grouping
┌────────────────────────┐
│ Notifications          │ Header
├────────────────────────┤
│ All | Verified | @      │ Tabs
├────────────────────────┤
│ ❤️ ⚫⚫⚫ user1, user2  │
│ and 3 others liked...  │
│ "Post preview text..." │
│ 2h ago            [New]│
├────────────────────────┤
│ 🔁 ⚫ user3 reposted  │
│ "Another post..."      │
│ 5h ago                 │
└────────────────────────┘
```

---

## 🎨 Color Palette

### Primary

- `primary-500`: #1DA1F2 (Twitter Blue)
- `primary-600`: Darker blue (hover)

### Neutrals

- `black`: #000000
- `neutral-900`: #171717
- `neutral-800`: #262626
- `neutral-700`: #404040
- `neutral-500`: #737373
- `neutral-400`: #A3A3A3

### Accent

- `pink-600`: #DB2777 (Like)
- `green-500`: #22C55E (Repost)
- `red-500`: #EF4444 (Danger)
- `orange-500`: #F97316 (Warning)

---

## 🎯 Common Patterns

### Action Button (Twitter-style)

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

### Sticky Header

```tsx
<div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10">
  <h1 className="text-xl font-bold px-4 py-3">Title</h1>
</div>
```

### Empty State

```tsx
<div className="p-8 text-center">
  <svg className="w-16 h-16 mx-auto text-neutral-700 mb-4">{/* icon */}</svg>
  <h3 className="text-3xl font-bold text-white mb-2">Nothing here yet</h3>
  <p className="text-neutral-500 mb-4">Helpful message about what to do</p>
  <Button>Take Action</Button>
</div>
```

---

## 📸 Screenshots

All components are production-ready and match Twitter/X's design language!

**Try them out:**

1. Start the dev server: `npm run dev`
2. Navigate through the app
3. See all components in action
4. Customize as needed!

---

## 🎉 That's All!

You now have a complete component library to build a Twitter/X clone. Mix and match these components to create any feature you need!
