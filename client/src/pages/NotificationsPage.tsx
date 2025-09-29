export default function NotificationsPage() {
  return (
    <div className="flex w-full">
      {/* Main Content */}
      <div className="flex-1 bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-orange-200 z-10">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-primary-600">
              Notifications
            </h1>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-8">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-5 5v-5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 7H4l5-5v5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary-600 mb-3">
              Coming Soon!
            </h2>
            <p className="text-primary-400 text-lg max-w-md mx-auto">
              We're working hard to bring you notifications. Stay tuned for
              updates on likes, comments, and more!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
