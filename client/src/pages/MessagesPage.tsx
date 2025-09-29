export default function MessagesPage() {
  return (
    <div className="h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-orange-200 px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-primary-900">Messages</h1>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary-500"
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
          <h2 className="text-2xl font-bold text-primary-900 mb-3">
            Coming Soon!
          </h2>

          <p className="text-primary-600 mb-6 leading-relaxed">
            We're working hard to bring you an amazing messaging experience.
            Stay tuned for real-time conversations with your friends and
            followers.
          </p>

          {/* Features Preview */}
          <div className="bg-white border border-orange-200 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-primary-900 mb-3">
              What's Coming:
            </h3>
            <ul className="space-y-2 text-sm text-primary-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                Real-time messaging
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                Group conversations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                Media sharing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                Message reactions
              </li>
            </ul>
          </div>

          {/* Additional Message */}
          <p className="text-xs text-primary-500 mt-6">
            Follow us for updates on when messaging will be available!
          </p>
        </div>
      </div>
    </div>
  );
}
