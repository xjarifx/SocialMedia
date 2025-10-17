interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-neutral-800";

  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="border-b border-neutral-800 px-4 py-3">
      <div className="flex space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
          </div>
          <div className="flex items-center space-x-8">
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={60} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="w-full">
      <Skeleton variant="rectangular" className="w-full h-48" />
      <div className="px-4 pb-4">
        <div className="-mt-16 mb-4">
          <Skeleton
            variant="circular"
            width={128}
            height={128}
            className="border-4 border-black"
          />
        </div>
        <Skeleton variant="text" width="40%" height={24} className="mb-2" />
        <Skeleton variant="text" width="30%" className="mb-4" />
        <Skeleton variant="text" width="80%" className="mb-2" />
        <Skeleton variant="text" width="60%" className="mb-4" />
        <div className="flex space-x-4">
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={100} />
        </div>
      </div>
    </div>
  );
}
