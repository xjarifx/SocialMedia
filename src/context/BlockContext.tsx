import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { blocksAPI } from "@/services/api";
import type { BlockedUser } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface BlockContextType {
  blockedUsers: BlockedUser[];
  isBlocked: (username: string) => boolean;
  blockUser: (username: string) => Promise<void>;
  unblockUser: (username: string) => Promise<void>;
  refreshBlocks: () => Promise<void>;
  isLoading: boolean;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export function BlockProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshBlocks = useCallback(async () => {
    if (!user?.id) {
      setBlockedUsers([]);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await blocksAPI.list();
      setBlockedUsers(response.blocked || []);
    } catch (err) {
      console.error("Failed to load blocked users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshBlocks();
  }, [refreshBlocks]);

  const isBlocked = useCallback(
    (username: string) => {
      return blockedUsers.some((blocked) => blocked.user?.username === username);
    },
    [blockedUsers]
  );

  const blockUser = useCallback(
    async (username: string) => {
      try {
        const result = await blocksAPI.blockUser(username);
        setBlockedUsers((prev) => [...prev, result]);
        
        // Dispatch event for other components to react
        window.dispatchEvent(new CustomEvent("user-blocked", { detail: { username } }));
      } catch (err) {
        console.error("Failed to block user:", err);
        throw err;
      }
    },
    []
  );

  const unblockUser = useCallback(
    async (username: string) => {
      try {
        await blocksAPI.unblockUser(username);
        setBlockedUsers((prev) => prev.filter((blocked) => blocked.user?.username !== username));
        
        // Dispatch event for other components to react
        window.dispatchEvent(new CustomEvent("user-unblocked", { detail: { username } }));
      } catch (err) {
        console.error("Failed to unblock user:", err);
        throw err;
      }
    },
    []
  );

  return (
    <BlockContext.Provider
      value={{
        blockedUsers,
        isBlocked,
        blockUser,
        unblockUser,
        refreshBlocks,
        isLoading,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
}

export function useBlocks() {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error("useBlocks must be used within a BlockProvider");
  }
  return context;
}
