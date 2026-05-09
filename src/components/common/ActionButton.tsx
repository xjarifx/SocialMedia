import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
  activeColor?: string;
  className?: string;
}

export function ActionButton({
  icon: Icon,
  count,
  isActive = false,
  onClick,
  activeColor = "bg-danger/20 text-danger",
  className = "",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
        isActive ? activeColor : "text-text-secondary hover:bg-surface-hover"
      } ${className}`}
    >
      <Icon className={`h-4 w-4 ${isActive ? "fill-current" : ""}`} />
      <span>{count}</span>
    </button>
  );
}
