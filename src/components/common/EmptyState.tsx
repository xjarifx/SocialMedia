import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  iconClassName = "text-text-primary",
}: EmptyStateProps) {
  return (
    <div className="border border-border bg-background px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
        <Icon className={`h-7 w-7 ${iconClassName}`} />
      </div>
      <p className="text-base font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
}
