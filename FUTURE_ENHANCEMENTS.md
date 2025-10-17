# Future Enhancements & TODOs

This document outlines features and improvements that can be added to make the Twitter/X clone even more complete.

## 🎯 High Priority Enhancements

### 1. **Infinite Scroll**

**Status**: Infrastructure ready, needs implementation

```tsx
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

function PostFeed() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 1 }) => api.getPosts(pageParam),
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page) =>
        page.posts.map((post) => <PostCard {...post} />)
      )}
      <div ref={ref}>{isFetchingNextPage && <PostSkeleton />}</div>
    </div>
  );
}
```

### 2. **Post Detail Modal**

**Location**: `src/components/posts/PostDetailModal.tsx`

```tsx
import Modal from "../ui/Modal";

function PostDetailModal({ postId, isOpen, onClose }) {
  const { data: post } = useQuery(["post", postId], () => api.getPost(postId));
  const { data: comments } = useQuery(["comments", postId], () =>
    api.getComments(postId)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Full post details */}
      {/* Comment section */}
      {/* Reply composer */}
    </Modal>
  );
}
```

### 3. **Image Lightbox**

**Location**: `src/components/ui/ImageLightbox.tsx`

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ImageLightbox({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => Math.min(images.length - 1, i + 1));

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/95 z-50">
        {/* Image viewer */}
        {/* Navigation arrows */}
        {/* Thumbnail strip */}
        {/* Close button */}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 4. **Profile Hover Cards**

**Location**: `src/components/ui/ProfileHoverCard.tsx`

```tsx
import { useState } from "react";

function ProfileHoverCard({ username, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const { data: profile } = useQuery(
    ["profile", username],
    () => api.getUserProfile(username),
    { enabled: isVisible }
  );

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && profile && (
        <div className="absolute z-50 bg-black border rounded-xl p-4 shadow-xl">
          {/* Mini profile info */}
          {/* Follow button */}
        </div>
      )}
    </div>
  );
}
```

### 5. **Real-time Updates**

**Needs**: WebSocket or polling implementation

```tsx
// Using polling
const { data } = useQuery(["posts"], api.getPosts, {
  refetchInterval: 30000, // Poll every 30 seconds
});

// Or WebSocket
useEffect(() => {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    queryClient.invalidateQueries(["posts"]);
  };

  return () => ws.close();
}, []);
```

## 🎨 UI/UX Enhancements

### 6. **Emoji Picker**

**Package**: emoji-picker-react

```bash
npm install emoji-picker-react
```

```tsx
import EmojiPicker from "emoji-picker-react";

function PostComposer() {
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject) => {
    setContent((prev) => prev + emojiObject.emoji);
  };

  return (
    <>
      <button onClick={() => setShowPicker(!showPicker)}>😊</button>
      {showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
    </>
  );
}
```

### 7. **GIF Picker**

**API**: Giphy API

```tsx
function GifPicker({ onSelect }) {
  const [search, setSearch] = useState("");
  const { data } = useQuery(["gifs", search], () =>
    fetch(
      `https://api.giphy.com/v1/gifs/search?q=${search}&api_key=YOUR_KEY`
    ).then((r) => r.json())
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      {data?.data.map((gif) => (
        <img
          key={gif.id}
          src={gif.images.fixed_height_small.url}
          onClick={() => onSelect(gif.images.original.url)}
        />
      ))}
    </div>
  );
}
```

### 8. **Poll Creation**

**Location**: `src/components/posts/PollComposer.tsx`

```tsx
function PollComposer() {
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(1440); // minutes

  return (
    <div className="space-y-3">
      {options.map((option, i) => (
        <input
          key={i}
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${i + 1}`}
        />
      ))}
      <button onClick={() => setOptions([...options, ""])}>Add option</button>
      <select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      >
        <option value={1440}>1 day</option>
        <option value={4320}>3 days</option>
        <option value={10080}>7 days</option>
      </select>
    </div>
  );
}
```

### 9. **Bookmarks Feature**

**Locations**:

- `src/pages/BookmarksPage.tsx`
- Update `Sidebar.tsx` with bookmark icon

```tsx
function BookmarksPage() {
  const { data: bookmarks } = useQuery(["bookmarks"], api.getBookmarks);

  return (
    <div>
      <h1>Bookmarks</h1>
      {bookmarks?.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

// In PostCard
<button onClick={() => toggleBookmark(post.id)}>
  <BookmarkIcon filled={post.isBookmarked} />
</button>;
```

### 10. **Lists Feature**

Similar to Twitter Lists

```tsx
function ListsPage() {
  const { data: lists } = useQuery(["lists"], api.getLists);

  return (
    <div>
      {lists?.map((list) => (
        <div key={list.id} onClick={() => navigate(`/lists/${list.id}`)}>
          <h3>{list.name}</h3>
          <p>{list.memberCount} members</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Technical Improvements

### 11. **Virtual Scrolling**

**Package**: react-window

```tsx
import { FixedSizeList } from "react-window";

function PostFeed({ posts }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <PostCard post={posts[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={window.innerHeight}
      itemCount={posts.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 12. **Advanced Search**

**Location**: `src/pages/SearchPage.tsx`

```tsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("top"); // top, latest, people, photos, videos

  const { data } = useQuery(
    ["search", query, filter],
    () => api.search(query, filter),
    { enabled: query.length > 0 }
  );

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <Tabs
        tabs={[
          { id: "top", label: "Top" },
          { id: "latest", label: "Latest" },
          { id: "people", label: "People" },
          { id: "photos", label: "Photos" },
          { id: "videos", label: "Videos" },
        ]}
        activeTab={filter}
        onChange={setFilter}
      />
      {/* Results */}
    </div>
  );
}
```

### 13. **Video Upload Support**

```tsx
function PostComposer() {
  const [video, setVideo] = useState(null);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file.size > 512 * 1024 * 1024) {
      // 512MB limit
      showToast("Video too large", "error");
      return;
    }
    setVideo(file);
  };

  return (
    <>
      <input type="file" accept="video/*" onChange={handleVideoSelect} />
      {video && (
        <video src={URL.createObjectURL(video)} controls className="w-full" />
      )}
    </>
  );
}
```

### 14. **Progressive Web App (PWA)**

**Files to create**:

- `public/manifest.json`
- `public/sw.js` (service worker)
- Update `index.html`

```json
// manifest.json
{
  "name": "Twitter Clone",
  "short_name": "X",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#1DA1F2",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 15. **Analytics Integration**

```tsx
// utils/analytics.ts
export const trackEvent = (eventName: string, properties?: object) => {
  // Google Analytics
  gtag("event", eventName, properties);

  // Or custom analytics
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify({ event: eventName, ...properties }),
  });
};

// Usage
trackEvent("post_created", { postId: 123 });
trackEvent("profile_viewed", { username: "user" });
```

## 🎮 Advanced Features

### 16. **Spaces (Audio Rooms)**

Live audio conversations feature

### 17. **Communities**

Topic-based discussion groups

### 18. **Twitter Blue Features**

- Edit posts
- Longer posts (4000 chars)
- Verified badge
- Custom app icons

### 19. **Advanced Privacy Settings**

- Protected accounts
- Muted words
- Blocked users
- Hidden replies

### 20. **Monetization**

- Super Follows
- Tip jar
- Subscriptions
- Promoted content

## 📱 Mobile App

### 21. **React Native Version**

Port the app to mobile using React Native

- Reuse component logic
- Native animations
- Push notifications
- Camera integration

## 🔐 Security Enhancements

### 22. **Two-Factor Authentication**

```tsx
function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");

  const enable2FA = async () => {
    const { secret, qr } = await api.setup2FA();
    setQrCode(qr);
  };

  const verify2FA = async () => {
    await api.verify2FA(code);
  };
}
```

### 23. **Rate Limiting**

Client-side rate limiting for API calls

### 24. **CSRF Protection**

Token-based CSRF protection

## 🎯 Content Moderation

### 25. **Report System**

Report posts, users, comments

### 26. **Content Warnings**

Sensitive content warnings and blurring

### 27. **Automated Moderation**

AI-based content filtering

## 📊 Analytics Dashboard

### 28. **User Analytics**

- Post impressions
- Engagement rates
- Follower growth
- Top posts

## 🌍 Internationalization

### 29. **Multi-language Support**

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("welcome")}</h1>;
}
```

## 🎨 Customization

### 30. **Theme Customization**

- Multiple dark themes
- Light mode
- Custom colors
- Font size options

---

## Priority Order

### Phase 1 (Core UX)

1. Infinite scroll
2. Post detail modal
3. Image lightbox
4. Profile hover cards

### Phase 2 (Engagement)

5. Real-time updates
6. Emoji picker
7. GIF picker
8. Bookmarks

### Phase 3 (Content)

9. Poll creation
10. Video upload
11. Advanced search
12. Lists

### Phase 4 (Performance)

13. Virtual scrolling
14. PWA
15. Analytics

### Phase 5 (Advanced)

16-30. Based on user needs

---

## Getting Started with Enhancements

1. Pick a feature from above
2. Create necessary files
3. Add API endpoints (if needed)
4. Test thoroughly
5. Add to documentation

Remember: The current implementation is **production-ready**. These are enhancements to make it even better!
