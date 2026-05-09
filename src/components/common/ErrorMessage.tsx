interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  return (
    <div
      className={`rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger ${className}`}
    >
      {message}
    </div>
  );
}
