import { useState } from "react";
import Tabs from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import { formatDateDisplay } from "../utils/time";

interface Notification {
  id: number;
  type: "like" | "repost" | "follow" | "reply" | "mention";
  users: { username: string; avatar?: string }[];
  content?: string;
  postPreview?: string;
  createdAt: string;
  read: boolean;
}

// Mock data - replace with API call
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "like",
    users: [{ username: "techguru" }, { username: "designpro" }],
    postPreview: "Just launched my new project! Check it out...",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: "follow",
    users: [{ username: "devmaster" }],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: 3,
    type: "repost",
    users: [{ username: "codeenthusiast" }],
    postPreview: "Amazing tutorial on React hooks!",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    read: true,
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications] = useState(mockNotifications);

  const tabs = [
    { id: "all", label: "All" },
    { id: "verified", label: "Verified" },
    { id: "mentions", label: "Mentions" },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return (
          <svg
            className="w-7 h-7 text-pink-600 fill-pink-600"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "repost":
        return (
          <svg
            className="w-7 h-7 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.18 2.18V7.5a3.5 3.5 0 0 0-3.5-3.5h-3.5a.75.75 0 0 0 0 1.5h3.5a2 2 0 0 1 2 2v10.35l-2.18-2.18a.749.749 0 1 0-1.06 1.06l3.5 3.5a.749.749 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06zm-10.76 3.33h-3.5a2 2 0 0 1-2-2V6.65l2.18 2.18a.749.749 0 1 0 1.06-1.06l-3.5-3.5a.749.749 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06L5.93 6.65V17a3.5 3.5 0 0 0 3.5 3.5h3.5a.75.75 0 0 0 0-1.5z" />
          </svg>
        );
      case "follow":
        return (
          <svg
            className="w-7 h-7 text-primary-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.5 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm-2.5 2c3.59 0 6.5 2.91 6.5 6.5V23h-13v-2.5c0-3.59 2.91-6.5 6.5-6.5zM6.5 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zM9 14c-2.21 0-4.21.9-5.66 2.34A6.95 6.95 0 0 0 2 21v2h7v-2.5c0-2.13.82-4.06 2.15-5.5H9z" />
          </svg>
        );
      case "reply":
        return (
          <svg
            className="w-7 h-7 text-primary-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const usernames = notification.users.map((u) => u.username);
    const count = usernames.length;

    let text = "";
    if (count === 1) {
      text = usernames[0];
    } else if (count === 2) {
      text = `${usernames[0]} and ${usernames[1]}`;
    } else {
      text = `${usernames[0]}, ${usernames[1]}, and ${count - 2} ${
        count - 2 === 1 ? "other" : "others"
      }`;
    }

    switch (notification.type) {
      case "like":
        return `${text} liked your post`;
      case "repost":
        return `${text} reposted your post`;
      case "follow":
        return `${text} followed you`;
      case "reply":
        return `${text} replied to your post`;
      case "mention":
        return `${text} mentioned you`;
      default:
        return text;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Notifications List */}
      <div>
        {notifications.length === 0 ? (
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
              <h2 className="text-2xl font-semibold text-white mb-3">
                Nothing to see here — yet
              </h2>
              <p className="text-neutral-500 text-[15px] max-w-md mx-auto">
                From likes to reposts and a whole lot more, this is where all
                the action happens.
              </p>
            </div>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-neutral-800 px-4 py-3 hover:bg-neutral-900/50 transition-colors cursor-pointer ${
                !notification.read ? "bg-neutral-900/30" : ""
              }`}
            >
              <div className="flex space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 pt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Avatars */}
                  <div className="flex items-center space-x-2 mb-2">
                    {notification.users.slice(0, 3).map((user, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white font-bold text-xs">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Text */}
                  <div className="mb-1">
                    <p className="text-[15px] text-white">
                      <span className="font-bold">
                        {getNotificationText(notification)}
                      </span>
                    </p>
                  </div>

                  {/* Post Preview */}
                  {notification.postPreview && (
                    <p className="text-[15px] text-neutral-500 line-clamp-2">
                      {notification.postPreview}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatDateDisplay(notification.createdAt)}
                  </p>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="primary" size="sm">
                        New
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
