interface LoadingSkeletonProps {
  variant?: "post" | "user" | "list";
  count?: number;
}

export function LoadingSkeleton({
  variant = "post",
  count = 3,
}: LoadingSkeletonProps) {
  switch (variant) {
    case "post":
      return (
        <div className="space-y-0">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="border-b border-border bg-background p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-surface" />
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-24 animate-pulse rounded-lg bg-surface" />
                    <div className="h-3 w-16 animate-pulse rounded-lg bg-surface" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-lg bg-surface" />
                    <div className="h-3 w-4/5 animate-pulse rounded-lg bg-surface" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-16 animate-pulse rounded-xl bg-surface" />
                    <div className="h-7 w-16 animate-pulse rounded-xl bg-surface" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case "user":
      return (
        <div>
          {[...Array(count)].map((_, i) => (
            <div key={i} className="border-b border-border bg-background p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 animate-pulse rounded-full bg-surface" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-surface" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-surface" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <div>
          {[...Array(count)].map((_, i) => (
            <div key={i} className="border-b border-border bg-background p-5">
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-surface" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
