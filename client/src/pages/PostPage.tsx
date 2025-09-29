import PostComposer from "../components/posts/PostComposer";

export default function PostPage() {
  return (
    <div className="flex w-full">
      {/* Main Post Content */}
      <div className="flex-1 bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-orange-200 z-10">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-primary-600">
              Create Post
            </h1>
          </div>
        </div>

        {/* Post Composer */}
        <div className="p-6">
          <PostComposer />
        </div>

        {/* Recent Posts Preview */}
        <div className="border-t border-orange-200 p-6">
          <h2 className="text-lg font-semibold text-primary-600 mb-4">
            Your Recent Posts
          </h2>
          <div className="text-center p-8">
            <p className="text-primary-400">
              Your recent posts will appear here after you create them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
