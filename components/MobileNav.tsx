"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, Bell, User, Search, CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Search, label: "Explore", to: "/search" },
  { icon: CreditCard, label: "Subscription", to: "/billing" },
  { icon: Bell, label: "Notifications", to: "/notifications" },
  { icon: User, label: "Profile", to: "/profile" },
];

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handlePostClick = () => {
    window.dispatchEvent(new CustomEvent("open-post-composer"));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around px-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.to;
          return (
            <button
              key={item.to}
              onClick={() => router.push(item.to)}
              className={cn(
                "relative flex flex-1 cursor-pointer items-center justify-center py-3 transition-colors duration-200",
                isActive
                  ? "text-text-primary"
                  : "text-text-secondary"
              )}
              title={item.label}
            >
              <item.icon 
                className="h-[26px] w-[26px]" 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
              )}
            </button>
          );
        })}
        
        {/* Post Button */}
        <button
          onClick={handlePostClick}
          className="relative flex flex-1 cursor-pointer items-center justify-center py-3"
          title="Post"
        >
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105">
            <Plus className="h-[22px] w-[22px]" strokeWidth={2.5} />
          </div>
        </button>

        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.to;
          return (
            <button
              key={item.to}
              onClick={() => router.push(item.to)}
              className={cn(
                "relative flex flex-1 cursor-pointer items-center justify-center py-3 transition-colors duration-200",
                isActive
                  ? "text-text-primary"
                  : "text-text-secondary"
              )}
              title={item.label}
            >
              <item.icon 
                className="h-[26px] w-[26px]" 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
