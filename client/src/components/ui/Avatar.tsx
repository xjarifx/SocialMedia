interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({
  src,
  alt = "User avatar",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const baseStyles =
    "rounded-full object-cover bg-neutral-200 flex items-center justify-center";
  const combinedClassName = `${baseStyles} ${sizes[size]} ${className}`;

  if (!src) {
    return (
      <div className={combinedClassName}>
        <svg
          className={`${
            size === "xs"
              ? "h-3 w-3"
              : size === "sm"
              ? "h-4 w-4"
              : size === "md"
              ? "h-5 w-5"
              : size === "lg"
              ? "h-6 w-6"
              : "h-8 w-8"
          } text-neutral-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  return <img src={src} alt={alt} className={combinedClassName} />;
}
