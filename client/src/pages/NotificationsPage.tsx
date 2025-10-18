interface Notification {
  id: number;
  type: "like" | "repost" | "follow" | "reply" | "mention";
  users: { username: string; avatar?: string }[];
  content?: string;
  postPreview?: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const notifications: Notification[] = [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div>
        {notifications.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center p-8">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-neutral-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Nothing to see here — yet
              </h2>
              <p className="text-neutral-500 text-sm max-w-md mx-auto">
                This is where all the action happens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
