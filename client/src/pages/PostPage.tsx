import PostComposer from "../components/posts/PostComposer";

export default function PostPage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Main Post Content */}
      <div className="flex-1 bg-black">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-white">Create Post</h1>
          </div>
        </div>

        {/* Post Composer */}
        <div className="max-w-2xl mx-auto">
          <PostComposer />
        </div>
      </div>
    </div>
  );
}
