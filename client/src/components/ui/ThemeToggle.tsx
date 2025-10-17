import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-800 bg-neutral-900 text-primary-400 hover:bg-neutral-800 hover:border-orange-200 dark:hover:border-neutral-700 transition-colors ${className}`}
    >
      {theme === "dark" ? (
        <>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M21.752 15.002A9.718 9.718 0 0112.004 22C6.477 22 2 17.523 2 12.004 2 7.539 4.943 3.77 9.002 2.248a.75.75 0 01.967.967A7.718 7.718 0 0010 5.5C10 10.194 13.806 14 18.5 14c1.137 0 2.226-.225 3.285-.66a.75.75 0 01.967.967z" />
          </svg>
          <span className="text-sm">Dark</span>
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 4a1 1 0 011 1v1h-2v-1a1 1 0 011-1zm0-22a1 1 0 011-1h1v2h-1a1 1 0 01-1-1zM1 13a1 1 0 01-1-1v-1h2v1a1 1 0 01-1 1zm22 0a1 1 0 01-1-1v-1h2v1a1 1 0 01-1 1zM3.221 20.778l1.414-1.414L6.05 20.78 4.636 22.193 3.22 20.778zM17.95 3.222l1.414-1.415L20.778 3.22l-1.414 1.414L17.95 3.22zM20.778 20.778l-1.414-1.414 1.414-1.414 1.414 1.414-1.414 1.414zM3.222 3.222L4.636 4.636 3.222 6.05 1.808 4.636 3.222 3.222z" />
          </svg>
          <span className="text-sm">Light</span>
        </>
      )}
    </button>
  );
}
