export default function MessagesPage() {
  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      {/* Header */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-neutral-100">
            Messages
          </h1>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          {/* Coming Soon Text */}
          <h2 className="text-2xl font-bold text-neutral-100 mb-3">
            Coming Soon!
          </h2>

          <p className="text-neutral-400 mb-6 leading-relaxed">
            We're working hard to bring you an amazing messaging experience.
            Stay tuned for real-time conversations with your friends and
            followers.
          </p>

          {/* Features Preview */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">
              What's Coming:
            </h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full mr-3"></div>
                Real-time messaging
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full mr-3"></div>
                Group conversations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full mr-3"></div>
                Media sharing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full mr-3"></div>
                Message reactions
              </li>
            </ul>
          </div>

          {/* Additional Message */}
          <p className="text-xs text-neutral-400 mt-6">
            Follow us for updates on when messaging will be available!
          </p>
        </div>
      </div>
    </div>
  );
}
