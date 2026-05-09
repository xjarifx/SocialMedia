"use client";

import { useEffect, useState } from "react";
import { blocksAPI } from "@/services/api";
import type { BlockedUser } from "@/services/api";
import { ShieldOff } from "lucide-react";

export default function BlocksPage() {
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlocked = async () => {
    try {
      setIsLoading(true);
      const response = await blocksAPI.list();
      setBlocked(response.blocked);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load blocks";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlocked();
  }, []);

  const handleUnblock = async (username: string) => {
    try {
      await blocksAPI.unblockUser(username);
      setBlocked((prev) =>
        prev.filter((item) => item.user.username !== username),
      );
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  };

  return (
    <div>
      <h1 className="border-b border-white/15 p-3 text-[20px] font-medium text-white">
        Blocked users
      </h1>

      {error && (
        <div className="rounded-none border border-[#ea4335]/30 bg-[#fce8e6] px-4 py-3 text-[13px] text-[#c5221f]">
          {error}
        </div>
      )}

      {isLoading ? (
        <div>
          {[0, 1].map((i) => (
            <div key={i} className="border-b border-white/15 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-none bg-white/15" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : blocked.length === 0 ? (
        <div className="rounded-none border border-white/15 bg-white/5 px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-none bg-white/10">
            <ShieldOff className="h-7 w-7 text-white/70" />
          </div>
          <p className="text-[15px] font-medium text-white">No blocked users</p>
          <p className="mt-1 text-[13px] text-white/60">
            Users you block will appear here.
          </p>
        </div>
      ) : (
        <div>
          {blocked.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-white/15 bg-white/5 p-4 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-none bg-[#ea4335]/15 text-[12px] font-medium text-[#ea4335]">
                  {item.user.firstName[0]}
                  {item.user.lastName[0]}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white">
                    {item.user.firstName} {item.user.lastName}
                  </p>
                  <p className="text-[12px] text-white/60">
                    @{item.user.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleUnblock(item.user.username)}
                className="cursor-pointer rounded-none px-4 py-1.5 text-[13px] font-medium text-[#ea4335] transition hover:bg-[#ea4335]/15"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
