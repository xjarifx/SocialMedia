import { ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  action?: {
    icon: LucideIcon;
    onClick: () => void;
    label: string;
  };
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backPath = "/",
  action,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-sm p-3">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => router.push(backPath)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-text-secondary transition-colors duration-200 hover:bg-surface-hover hover:text-text-primary"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-medium text-text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-text-secondary transition-colors duration-200 hover:bg-surface-hover hover:text-text-primary"
          title={action.label}
        >
          <action.icon className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
}
