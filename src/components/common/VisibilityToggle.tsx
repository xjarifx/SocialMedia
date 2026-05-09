import { Globe, Lock } from "lucide-react";

interface VisibilityToggleProps {
  visibility: "PUBLIC" | "PRIVATE";
  onToggle: () => void;
  className?: string;
}

export function VisibilityToggle({
  visibility,
  onToggle,
  className = "",
}: VisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`cursor-pointer ${className}`}
      aria-label="Change visibility"
      title={`Visibility: ${visibility.toLowerCase()}`}
    >
      {visibility === "PUBLIC" ? (
        <Globe className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
    </button>
  );
}
