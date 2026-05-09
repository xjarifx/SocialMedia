"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Bell, Search, User, LogOut, MoreHorizontal, CreditCard } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  onOpenPostComposer?: () => void;
}

export function TopNav({ onOpenPostComposer }: TopNavProps) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Search, label: "Explore", to: "/search" },
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: CreditCard, label: "Subscription", to: "/billing" },
    { icon: User, label: "Profile", to: "/profile" },
  ];

  const handleConfirmLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : "User";
  const handle = user?.username ?? "user";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[275px] shrink-0 px-2 lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-[53px] items-center px-3">
          <button
            onClick={() => router.push("/")}
            className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-surface-hover"
            aria-label="Home"
          >
            <Image src="/fire.png" alt="Logo" width={64} height={64} className="h-[30px] w-[30px]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <motion.button
                key={item.to}
                onClick={() => router.push(item.to)}
                className={cn(
                  "group flex w-fit cursor-pointer items-center gap-5 rounded-full px-4 py-3 text-left transition-colors duration-200 hover:bg-surface-hover",
                  "text-text-primary"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon 
                    className="h-[26px] w-[26px]" 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
                <span className={cn(
                  "text-xl",
                  isActive ? "font-bold" : "font-normal"
                )}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Post Button */}
        <div className="mb-4 px-3">
          <Button
            onClick={() =>
              onOpenPostComposer ? onOpenPostComposer() : router.push("/compose")
            }
            className="w-full rounded-full px-8 py-3 text-base font-bold"
          >
            Post
          </Button>
        </div>

        {/* User Profile Button */}
        <div className="mb-4 px-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-full p-3 transition-colors duration-200 hover:bg-surface-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent text-sm font-semibold text-white">
              {initials || "U"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-base font-bold text-text-primary">
                {displayName}
              </div>
              <div className="truncate text-base text-text-secondary">
                @{handle}
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 text-text-primary" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
        <div className="flex h-[53px] items-center justify-between px-4">
          <button
            onClick={() => router.push("/")}
            className="flex shrink-0 cursor-pointer items-center gap-2"
          >
            <Image
              src="/fire.png"
              alt="Social Network logo"
              width={64}
              height={64}
              className="h-8 w-8"
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-primary transition-colors duration-200 hover:bg-surface-hover"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Sign out?</DialogTitle>
            <DialogDescription className="text-text-secondary">
              You will need to log in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
              className="border-border text-text-primary hover:bg-surface-hover"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
