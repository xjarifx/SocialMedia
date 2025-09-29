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
    "w-full px-3 py-2 border rounded-soft text-neutral-900 placeholder-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  const stateStyles = error
    ? "border-red-500 bg-red-50"
    : "border-neutral-300 bg-white hover:border-neutral-400";

  const combinedClassName = `${baseStyles} ${stateStyles} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input type={type} className={combinedClassName} {...props} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
