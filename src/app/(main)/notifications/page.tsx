"use client";

import { useEffect, useState } from "react";
import { notificationsAPI } from "@/lib/services/api";
import type { Notification } from "@/lib/services/api";
import { Bell, RefreshCw } from "lucide-react";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorMessage,
} from "@/components";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationsAPI.list();
      setNotifications(response.notifications);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load notifications";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (notificationId: string) => {
    try {
      const updated = await notificationsAPI.markRead(notificationId, true);
      setNotifications((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationsAPI.remove(notificationId);
      setNotifications((prev) =>
        prev.filter((item) => item.id !== notificationId),
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <div>
      <div className="flex h-[53px] items-center justify-end border-b border-border bg-background px-4">
        <button
          onClick={loadNotifications}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-primary transition-colors duration-200 hover:bg-surface-hover"
          title="Refresh"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSkeleton variant="list" count={3} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="No notifications yet."
          iconClassName="text-[#1a73e8]"
        />
      ) : (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-white/15 bg-white/5 p-4 transition hover:bg-white/[0.07] ${
                !notification.read ? "border-l-4 border-l-[#1a73e8]" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    !notification.read ? "bg-[#1a73e8]/20" : "bg-white/10"
                  }`}
                >
                  <Bell
                    className={`h-4.5 w-4.5 ${
                      !notification.read ? "text-[#1a73e8]" : "text-white/60"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] text-white/90">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-[12px] text-white/55">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="cursor-pointer rounded-xl px-3 py-1.5 text-[12px] font-medium text-[#1a73e8] transition hover:bg-[#1a73e8]/20"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="cursor-pointer rounded-xl px-3 py-1.5 text-[12px] font-medium text-[#ea4335] transition hover:bg-[#ea4335]/15"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
