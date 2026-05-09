"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { followsAPI, type Follower } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FollowersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFollowers = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const data = await followsAPI.getUserFollowers(user.id);
        setFollowers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load followers");
      } finally {
        setIsLoading(false);
      }
    };
    loadFollowers();
  }, [user?.id]);

  return (
    <div>
      <h1 className="border-b border-border p-3 text-xl font-medium text-text-primary">
        Your followers
      </h1>

      {error && (
        <div className="rounded-none border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {isLoading ? (
        <div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 animate-pulse rounded-full bg-surface-hover" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-surface-hover" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-surface-hover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : followers.length === 0 ? (
        <div className="rounded-none border border-border bg-surface px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Users className="h-7 w-7 text-accent" />
          </div>
          <p className="text-base font-medium text-text-primary">No followers yet</p>
          <p className="mt-1 text-sm text-text-muted">
            When people follow you, they'll show up here.
          </p>
        </div>
      ) : (
        <div>
          {followers.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border bg-surface p-4 transition hover:bg-surface-hover"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent bg-accent/20 text-sm font-medium text-accent">
                  {item.follower?.firstName?.[0] || ""}
                  {item.follower?.lastName?.[0] || ""}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.follower?.firstName} {item.follower?.lastName}
                  </p>
                  <p className="text-xs text-text-muted">
                    @{item.follower?.username}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/users/${item.follower?.id}`)}
                className="rounded-full"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
