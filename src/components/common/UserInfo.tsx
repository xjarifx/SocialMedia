import Link from "next/link";
import { ProBadge } from "@/components/ProBadge";

interface UserInfoProps {
  name: string;
  handle: string;
  plan?: "FREE" | "PRO";
  userId?: string;
  currentUserId?: string;
  showHandle?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function UserInfo({
  name,
  handle,
  plan,
  userId,
  currentUserId,
  showHandle = true,
  size = "md",
  className = "",
}: UserInfoProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const handleSize = size === "sm" ? "text-xs" : "text-xs";

  const content = (
    <span
      className={`inline-flex items-center gap-1 font-medium text-text-primary ${textSize} ${className}`}
    >
      {name}
      <ProBadge isPro={plan === "PRO"} />
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {userId && currentUserId !== userId ? (
        <Link href={`/users/${userId}`} className="hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
      {showHandle && (
        <span className={`text-text-secondary ${handleSize}`}>@{handle}</span>
      )}
    </div>
  );
}
