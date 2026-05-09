import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <div className="text-6xl font-bold text-text-muted">404</div>
      <h1 className="text-xl font-bold text-text-primary">Page not found</h1>
      <p className="text-sm text-text-secondary">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Go home
      </Link>
    </div>
  );
}
