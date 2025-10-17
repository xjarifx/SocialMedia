import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const baseStyles =
    "bg-gradient-to-br from-neutral-900 to-neutral-900/95 border-2 border-neutral-800 rounded-xl shadow-soft-lg backdrop-blur-sm transition-all hover:border-neutral-700 hover:shadow-lg";

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const combinedClassName = `${baseStyles} ${paddingStyles[padding]} ${className}`;

  return <div className={combinedClassName}>{children}</div>;
}
