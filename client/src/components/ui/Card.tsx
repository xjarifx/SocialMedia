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
    "bg-white border border-neutral-200 rounded-soft-lg shadow-soft";

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const combinedClassName = `${baseStyles} ${paddingStyles[padding]} ${className}`;

  return <div className={combinedClassName}>{children}</div>;
}
