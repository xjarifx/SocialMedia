import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const baseStyles =
    "w-full px-4 py-2.5 border-2 rounded-xl text-neutral-100 placeholder-neutral-500 bg-neutral-800/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-neutral-800";

  const stateStyles = error
    ? "border-red-500 bg-red-950/50 focus:ring-red-500/50"
    : "border-neutral-700 hover:border-primary-500/50 hover:bg-neutral-800/70";

  const combinedClassName = `${baseStyles} ${stateStyles} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-neutral-300">
          {label}
        </label>
      )}
      <input type={type} className={combinedClassName} {...props} />
      {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-neutral-400">{helperText}</p>
      )}
    </div>
  );
}
