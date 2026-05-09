export default function MainLoading() {
  return (
    <div className="flex min-h-screen flex-col gap-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-border" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-border" />
              <div className="h-2 w-16 rounded bg-border" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-border" />
            <div className="h-3 w-3/4 rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
