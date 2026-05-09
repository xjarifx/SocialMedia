interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-[12px]",
  lg: "h-12 w-12 text-[15px]",
  xl: "h-20 w-20 text-[24px]",
};

const variantClasses = {
  default: "bg-surface text-text-primary border-2 border-accent",
  primary: "bg-accent text-white border-2 border-accent",
  secondary: "bg-surface text-accent border-2 border-accent",
};

export function Avatar({
  initials,
  size = "md",
  variant = "default",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {initials}
    </div>
  );
}
